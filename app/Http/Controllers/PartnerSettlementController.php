<?php

namespace App\Http\Controllers;

use App\Helpers\Subiekt\SubiektQueries;
use App\Http\Requests\StorePartnerSettlementRequest;
use App\Http\Requests\UpdatePartnerSettlementDocumentAcceptAllRequest;
use App\Http\Requests\UpdatePartnerSettlementDocumentAcceptRequest;
use App\Http\Requests\UpdatePartnerSettlementItemRequest;
use App\Http\Requests\UpdatePartnerSettlementRequest;
use App\Jobs\partners\CreateInvoiceCorrectionsFromPartnerSettlement;
use App\Jobs\partners\CreateInvoiceFromPartnerSettlement;
use App\Models\Client\Client;
use App\Models\Partner;
use App\Models\PartnerSettlement;
use App\Models\PartnerSettlementDocument;
use App\Models\PartnerSettlementItem;
use App\Models\Products\Product;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Spatie\SimpleExcel\SimpleExcelReader;

class PartnerSettlementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Partner $partner)
    {
        $settlements = $partner->partnerSettlements()->with(["documents", "documents.items", "documents.items.product"])->get();
        // Iteracja przez wszystkie poziomy relacji, aby usunąć appendy z "product"
        $settlements->each(function ($settlement) {
            $settlement->documents->each(function ($document) {
                $document->items->each(function ($item) {
                    if ($item->product) { // Sprawdzamy, czy produkt istnieje
                        $item->product->setAppends([]);
                    }
                });
            });
        });
//        dd($settlements->toArray());

        return Inertia::render("System/Partners/PartnerSettlements", [
            "partner" => $partner,
            "settlements" => $settlements,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePartnerSettlementRequest $request, Partner $partner)
    {
        //Walidacja pliku
        if (count(SimpleExcelReader::create($request->file->getPathname(), "csv")->useDelimiter(",")->getHeaders()) > 1) {
            $delimiter = ",";
        } else if (count(SimpleExcelReader::create($request->file->getPathname(), "csv")->useDelimiter(";")->getHeaders()) > 1) {
            $delimiter = ";";
        } else {
            return redirect()->back()->withErrors(["Nieprawidłowy format pliku"]);
        }

        $headers = SimpleExcelReader::create($request->file->getPathname(), "csv")->useDelimiter($delimiter)->getHeaders();
        $expectedHeaders = ["Symbol", "Sprzedaz", "Zwroty", "Bilans", "Cena_netto", "Cena_brutto", "Wartosc_netto", "Wartosc_brutto"];
        if (array_diff($expectedHeaders, $headers)) {
            return redirect()->back()->withErrors(["Nieprawidłowe nagłówki w pliku"]);
        }


        $rows = SimpleExcelReader::create($request->file->getPathname(), "csv")->useDelimiter($delimiter)->getRows();

        $rows = $rows->map(function ($row, $id) {
            $row['Symbol'] = (string)$row['Symbol'] ?: null;
            if (Product::query()->where("symbol", $row['Symbol'])->count() !== 1) {
                return null;
            }
            $row['Sprzedaz'] = !empty($row['Sprzedaz']) ? (is_numeric($row['Sprzedaz']) ? (int)$row['Sprzedaz'] : null) : 0;
            $row['Zwroty'] = !empty($row['Zwroty']) ? (is_numeric($row['Zwroty']) ? (int)$row['Zwroty'] : null) : 0;
            $row['Bilans'] = !empty($row['Bilans']) ? (is_numeric($row['Bilans']) ? (int)$row['Bilans'] : null) : 0;

            if ($row['Bilans'] !== $row['Sprzedaz'] - $row['Zwroty']) {
                return null;
            }

            $row['Cena_netto'] = str_replace(',', '.', $row['Cena_netto']);
            $row['Cena_netto'] = is_numeric($row['Cena_netto']) ? (float)$row['Cena_netto'] : null;

            $row['Cena_brutto'] = str_replace(',', '.', $row['Cena_brutto']);
            $row['Cena_brutto'] = is_numeric($row['Cena_brutto']) ? (float)$row['Cena_brutto'] : null;

            $row['Wartosc_netto'] = str_replace(',', '.', $row['Wartosc_netto']);
            $row['Wartosc_netto'] = is_numeric($row['Wartosc_netto']) ? (float)$row['Wartosc_netto'] : null;

            $row['Wartosc_brutto'] = str_replace(',', '.', $row['Wartosc_brutto']);
            $row['Wartosc_brutto'] = is_numeric($row['Wartosc_brutto']) ? (float)$row['Wartosc_brutto'] : null;


            if (is_null($row['Symbol']) || is_null($row['Sprzedaz']) || is_null($row['Zwroty']) || is_null($row['Bilans']) ||
                is_null($row['Cena_netto']) || is_null($row['Cena_brutto']) ||
                is_null($row['Wartosc_netto']) || is_null($row['Wartosc_brutto'])) {
                return null;
            }


            return $row;
        });

        //Przygotowanie danych
        $rowsJson = json_encode($rows);
        $rows = collect(json_decode($rowsJson, true));

        if ($rows->filter(function ($row) {
                return is_null($row);
            })->count() > 0) {
            return redirect()->back()->withErrors(["Nieprawidłowe dane w pliku w linijce: " . $rows->search(null) + 1 + 1]);
        }


        //Operacje na danych
        $client = $partner->client;

        $sold = $rows->where("Bilans", ">", 0);
        $returned = $rows->where("Bilans", "<", 0);
//        dd($rows, $sold, $returned);

        //Zapisanie danych
        $settlement = new PartnerSettlement([
            "user_id" => auth()->user()->id,
            "settlement_date" => $request->date,
            "invoice_date" => $request->invoice_date,
            "sold_net" => 0,
            "sold_gross" => 0,
            "return_net" => 0,
            "return_gross" => 0,
            "total_net" => 0,
            "total_gross" => 0,
        ]);
        $settlement = $partner->partnerSettlements()->save($settlement);

        //Sprzedane
        $this->createInvoice($sold, $settlement, $partner, $client, $request);

        //Zwroty
        $this->createInvoicesCorrections($returned, $settlement, $partner, $client, $request);

        $settlement->update([
            "total_net" => $settlement->sold_net - $settlement->return_net,
            "total_gross" => $settlement->sold_gross - $settlement->return_gross,
        ]);

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(PartnerSettlement $partnerSettlement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PartnerSettlement $partnerSettlement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePartnerSettlementRequest $request, PartnerSettlement $partnerSettlement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Partner $partner, PartnerSettlement $partnerSettlement)
    {
//        dd($partner, $partnerSettlement);
        foreach ($partnerSettlement->documents as $document) {
            foreach ($document->items as $item) {
                $item->delete();
            }
            $document->delete();
        }
        $partnerSettlement->delete();
    }

    public function accept(UpdatePartnerSettlementDocumentAcceptRequest $request, Partner $partner, PartnerSettlement $partnerSettlement, PartnerSettlementDocument $partnerSettlementDocument)
    {
        $partnerSettlementDocument->update([
            "status" => 1,
        ]);

        if ($partnerSettlementDocument->type === 1) {
            CreateInvoiceFromPartnerSettlement::dispatch($partnerSettlementDocument);
        } else if ($partnerSettlementDocument->type === 2) {
            CreateInvoiceCorrectionsFromPartnerSettlement::dispatch($partnerSettlementDocument);
        }

        return redirect()->back();
    }

    public function acceptAll(UpdatePartnerSettlementDocumentAcceptAllRequest $request, Partner $partner, PartnerSettlement $partnerSettlement)
    {
        $documentsWithStatus0 = $partnerSettlement->documents()->whereIn("status", [0, 1])->get();
        foreach ($documentsWithStatus0 as $document) {
            $document->update([
                "status" => 1,
            ]);
            if ($document->type === 1) {
                CreateInvoiceFromPartnerSettlement::dispatch($document);
            } else if ($document->type === 2) {
                CreateInvoiceCorrectionsFromPartnerSettlement::dispatch($document);
            }
        }

        return redirect()->back();
    }

    public function updateItemPrice(UpdatePartnerSettlementItemRequest $request, Partner $partner, PartnerSettlement $partnerSettlement, PartnerSettlementDocument $partnerSettlementDocument, PartnerSettlementItem $partnerSettlementItem)
    {
        $price_net = $request->price;
        $partnerSettlementItem->update([
            'price_net_final' => $price_net,
            'price_gross_final' => round($price_net * (1 + $partnerSettlementItem->product->model->prices->vat_rate / 100)),
        ]);

        $items = $partnerSettlementDocument->items;


        $priceSummaryGrouped = $items->map(function ($row) {
            return collect([
                "quantity" => $row->quantity,
                "total_net" => $row->price_net_final,
                "vat_rate" => $row->product->model->prices->vat_rate,
            ]);
        })->groupBy("vat_rate");

        $priceSummaryGroupByVat = collect();
        foreach ($priceSummaryGrouped as $vat_rate => $items) {
            $total_net = $items->reduce(function ($carry, $item) {
                $carry += $item["total_net"] * $item["quantity"];
                return $carry;
            }, 0);
            $total_gross = round($total_net * (1 + $vat_rate / 100)); //mozliwe ze bez round

            $priceSummaryGroupByVat[$vat_rate] = [
                "total_net" => $total_net,
                "total_gross" => $total_gross,
                "vat_rate" => $vat_rate,
            ];
        }
        $priceSummary = $priceSummaryGroupByVat->reduce(function ($carry, $item) {
            $carry["total_net"] += $item["total_net"];
            $carry["total_gross"] += $item["total_gross"];
            return $carry;
        }, ["total_net" => 0, "total_gross" => 0]);


        $partnerSettlementDocument->update([
            'price_net_final' => $priceSummary["total_net"],
            'price_gross_final' => $priceSummary["total_gross"],
        ]);


        if ($partnerSettlementDocument->type === 1) {
            $partnerSettlement->update([
                "sold_net" => $priceSummary["total_net"],
                "sold_gross" => $priceSummary["total_gross"],
                "total_net" => $priceSummary["total_net"] - $partnerSettlement->return_net,
                "total_gross" => $priceSummary["total_gross"] - $partnerSettlement->return_gross,
            ]);
        } else if ($partnerSettlementDocument->type === 2) {
            $returnedDocuments = $partnerSettlement->documents()->where("type", 2)->get(["price_net_final", "price_gross_final"]);
            $partnerSettlement->update([
                "return_net" => $returnedDocuments->sum("price_net_final"),
                "return_gross" => $returnedDocuments->sum("price_gross_final"),
                "total_net" => $partnerSettlement->sold_net - $returnedDocuments->sum("price_net_final"),
                "total_gross" => $partnerSettlement->sold_gross - $returnedDocuments->sum("price_gross_final"),
            ]);
        }


    }


    private function createInvoice(Collection $sold, PartnerSettlement $settlement, Partner $partner, Client $client, StorePartnerSettlementRequest $request)
    {
        $soldArray = collect();
        foreach ($sold as $soldRow) {
            $product = Product::query()->where("symbol", $soldRow["Symbol"])->firstOrFail();
            $price = $product->model->priceForClientB2b($client);

            $soldItem = new PartnerSettlementItem([
                "quantity" => $soldRow['Bilans'],
                "price_net_original" => $soldRow['Cena_netto'] * 100,
                "price_gross_original" => $soldRow['Cena_brutto'] * 100,
                "price_net_computed" => $price['discounted_wholesale_net_price'],
                "price_gross_computed" => $price['discounted_wholesale_gross_price'],
                "price_net_final" => $price['discounted_wholesale_net_price'],
                "price_gross_final" => $price['discounted_wholesale_gross_price'],
            ]);
            $soldItem->product()->associate($product);
            $soldArray->push((object)[
                "item" => $soldItem,
                "vat_rate" => $price['vat_rate'],
            ]);
        }


        $priceSummaryGrouped = $soldArray->map(function ($row) {
            return collect([
                "quantity" => $row->item->quantity,
                "total_net" => $row->item->price_net_computed,
                "vat_rate" => $row->vat_rate,
            ]);
        })->groupBy("vat_rate");

        $priceSummaryGroupByVat = collect();
        foreach ($priceSummaryGrouped as $vat_rate => $items) {
            $total_net = $items->reduce(function ($carry, $item) {
                $carry += $item["total_net"] * $item["quantity"];
                return $carry;
            }, 0);
            $total_gross = round($total_net * (1 + $vat_rate / 100)); //mozliwe ze bez round

            $priceSummaryGroupByVat[$vat_rate] = [
                "total_net" => $total_net,
                "total_gross" => $total_gross,
                "vat_rate" => $vat_rate,
            ];
        }
        $priceSummary = $priceSummaryGroupByVat->reduce(function ($carry, $item) {
            $carry["total_net"] += $item["total_net"];
            $carry["total_gross"] += $item["total_gross"];
            return $carry;
        }, ["total_net" => 0, "total_gross" => 0]);


        $settlementInvoice = new PartnerSettlementDocument([
            "type" => 1,
            "document_subiekt_id" => null,
            "document_name" => null,
            "to_document_subiekt_id" => null,
            "to_document_name" => null,
            "quantity" => $sold->sum("Bilans"),
            "price_net_original" => $sold->sum(fn($row) => $row["Cena_netto"] * 100 * $row["Bilans"]),
            "price_gross_original" => $sold->sum(fn($row) => $row["Cena_brutto"] * 100 * $row["Bilans"]),
            "price_net_computed" => $priceSummary["total_net"],
            "price_gross_computed" => $priceSummary["total_gross"],
            "price_net_final" => $priceSummary["total_net"],
            "price_gross_final" => $priceSummary["total_gross"],
            "status" => 0,
        ]);


        $settlement->update([
            "sold_net" => $settlementInvoice->price_net_computed,
            "sold_gross" => $settlementInvoice->price_gross_computed,
        ]);
        $settlement->documents()->save($settlementInvoice);
        $settlementInvoice->items()->saveMany($soldArray->pluck("item"));
    }

    private function createInvoicesCorrections(Collection $returned, PartnerSettlement $settlement, Partner $partner, Client $client, StorePartnerSettlementRequest $request)
    {


        $invoicesToCorrection = collect();
        foreach ($returned as $returnedRow) {
            $product = Product::query()->where("symbol", $returnedRow["Symbol"])->firstOrFail();
            $queryResult = SubiektQueries::whatRemainInInvoiceAfterCorrections($partner->warehouse_id, $product->subiekt_id, $client->subiekt_id);
//            dd($queryResult);

            $invoicesToCorrectionWithProduct = collect();
            $howManyToCorrection = $returnedRow["Bilans"] * (-1);
            foreach ($queryResult as $invoice) {
                $invoice = (object)$invoice;

                // Jeśli nie ma już nic do korekty, zakończ pętlę
                if ($howManyToCorrection <= 0) {
                    break;
                }

                // Obliczenie: korekta może dotyczyć tylko maksymalnie dostępnej ilości na dokumencie
                $toCorrectNow = min($howManyToCorrection, (float)$invoice->suma_Ilosc);

                if ($toCorrectNow > 0) {
                    $invoicesToCorrectionWithProduct->push((object)[
                        'dok_Id' => $invoice->dok_Id,
                        'tw_Id' => $invoice->tw_Id,
                        'item_lp' => $invoice->ob_DokMagLp,
                        'toCorrect' => $toCorrectNow,
                        'price_net_original' => $returnedRow["Cena_netto"] * 100,
                        'price_gross_original' => $returnedRow["Cena_brutto"] * 100,
                        'price_net_computed' => $invoice->ob_CenaNetto * 100,
                        'price_gross_computed' => $invoice->ob_CenaBrutto * 100,
                    ]);

                    // Zmniejsz pozostałą ilość do skorygowania
                    $howManyToCorrection -= $toCorrectNow;
                }

            }

            if ($howManyToCorrection > 0) {
                throw new \Exception("Nie udało się znaleźć faktury do korekty dla towaru: (" . $product->id . ") " . $product->symbol . ". Zostało do korekty " . $howManyToCorrection . " sztuk");
            }

            // Dodajemy dane produktu z fakturami do kolekcji
            $invoicesToCorrection->push([
                'product' => $product,
                'corrections' => $invoicesToCorrectionWithProduct,
            ]);


        }
//        dd($invoicesToCorrection);

        $groupedInvoicesToCorrections = $invoicesToCorrection->flatMap(function ($item) {
            return $item['corrections']->map(function ($correction) {
                return [
                    'dok_Id' => $correction->dok_Id,
                    'tw_Id' => $correction->tw_Id,
                    'item_lp' => $correction->item_lp,
                    'toCorrect' => $correction->toCorrect,
                    'price_net_original' => $correction->price_net_original,
                    'price_gross_original' => $correction->price_gross_original,
                    'price_net_computed' => $correction->price_net_computed,
                    'price_gross_computed' => $correction->price_gross_computed,
                ];
            });
        })->groupBy('dok_Id')->map(function ($group) {
            return $group->map(function ($correction) {
                return [
                    'tw_Id' => $correction['tw_Id'],
                    'item_lp' => $correction['item_lp'],
                    'toCorrect' => $correction['toCorrect'],
                    'price_net_computed' => $correction['price_net_computed'],
                    'price_gross_computed' => $correction['price_gross_computed'],
                    'price_net_original' => $correction['price_net_original'],
                    'price_gross_original' => $correction['price_gross_original'],
                ];
            })->values();
        });


//        dd($groupedInvoicesToCorrections);

        foreach ($groupedInvoicesToCorrections as $invoiceSubiektId => $itemsToCorrection) {
            $returnedArray = collect();

            $priceSummaryGrouped = $itemsToCorrection->map(function ($row) {
                return collect([
                    "quantity" => $row['toCorrect'],
                    "total_net" => $row['price_net_computed'],
                    "vat_rate" => Product::findBySubiektId($row['tw_Id'])->model->prices->vat_rate,
                ]);
            })->groupBy("vat_rate");

            $priceSummaryGroupByVat = collect();
            foreach ($priceSummaryGrouped as $vat_rate => $items) {
                $total_net = $items->reduce(function ($carry, $item) {
                    $carry += $item["total_net"] * $item["quantity"];
                    return $carry;
                }, 0);
                $total_gross = round($total_net * (1 + $vat_rate / 100)); //mozliwe ze bez round

                $priceSummaryGroupByVat[$vat_rate] = [
                    "total_net" => $total_net,
                    "total_gross" => $total_gross,
                    "vat_rate" => $vat_rate,
                ];
            }
            $priceSummary = $priceSummaryGroupByVat->reduce(function ($carry, $item) {
                $carry["total_net"] += $item["total_net"];
                $carry["total_gross"] += $item["total_gross"];
                return $carry;
            }, ["total_net" => 0, "total_gross" => 0]);


            $settlementInvoiceCorrection = new PartnerSettlementDocument([
                "type" => 2,
                "document_subiekt_id" => null,
                "document_name" => null,
                "to_document_subiekt_id" => $invoiceSubiektId,
                "to_document_name" => SubiektQueries::getDocumentNameById($invoiceSubiektId),
                "quantity" => $itemsToCorrection->sum("toCorrect"),
                "price_net_original" => $itemsToCorrection->sum(fn($row) => $row["price_net_original"] * $row["toCorrect"]),
                "price_gross_original" => $itemsToCorrection->sum(fn($row) => $row["price_gross_original"] * $row["toCorrect"]),
                "price_net_computed" => $priceSummary["total_net"],
                "price_gross_computed" => $priceSummary["total_gross"],
                "price_net_final" => $priceSummary["total_net"],
                "price_gross_final" => $priceSummary["total_gross"],
                "status" => 0,
            ]);
//            dd($settlementInvoice);
            foreach ($itemsToCorrection as $itemToCorrection) {
                $product = Product::findBySubiektId($itemToCorrection['tw_Id']);
                $returnedItem = new PartnerSettlementItem([
                    "quantity" => $itemToCorrection['toCorrect'],
                    "price_net_original" => $itemToCorrection['price_net_original'],
                    "price_gross_original" => $itemToCorrection['price_gross_original'],
                    "price_net_computed" => $itemToCorrection['price_net_computed'],
                    "price_gross_computed" => $itemToCorrection['price_gross_computed'],
                    "price_net_final" => $itemToCorrection['price_net_computed'],
                    "price_gross_final" => $itemToCorrection['price_gross_computed'],
                    "document_position" => $itemToCorrection['item_lp'],
                ]);
                $returnedItem->product()->associate($product);
                $returnedArray->push($returnedItem);
            }


            $settlement->update([
                "return_net" => $settlement->return_net + $settlementInvoiceCorrection->price_net_computed,
                "return_gross" => $settlement->return_gross + $settlementInvoiceCorrection->price_gross_computed,
            ]);

            $settlement->documents()->save($settlementInvoiceCorrection);
            $settlementInvoiceCorrection->items()->saveMany($returnedArray);

        }
    }
}
