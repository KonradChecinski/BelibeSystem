<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Models\PartnerSettlement;
use App\Http\Requests\StorePartnerSettlementRequest;
use App\Http\Requests\UpdatePartnerSettlementRequest;
use App\Models\PartnerSettlementDocument;
use App\Models\PartnerSettlementItem;
use App\Models\Products\Product;
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
        //Sprzedane
        $soldArray = collect();
        foreach ($sold as $soldRow) {
            $product = Product::query()->where("symbol", $soldRow["Symbol"])->first();
            $price = $product->model->priceForClientB2b($client);

            $soldItem = new PartnerSettlementItem([
                "quantity" => $soldRow['Bilans'],
                "price_net_original" => $soldRow['Cena_netto'] * 100,
                "price_gross_original" => $soldRow['Cena_brutto'] * 100,
                "price_net_computed" => $price['discounted_wholesale_net_price'],
                "price_gross_computed" => $price['discounted_wholesale_gross_price'],
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
            "name" => "Faktura",
            "type" => 1,
            "document_subiekt_id" => null,
            "document_name" => null,
            "do_document_subiekt_id" => null,
            "do_document_name" => null,
            "quantity" => $sold->sum("Bilans"),
            "price_net_original" => $sold->sum(fn($row) => $row["Cena_netto"] * 100 * $row["Bilans"]),
            "price_net_computed" => $priceSummary["total_net"],
            "price_gross_original" => $sold->sum(fn($row) => $row["Cena_brutto"] * 100 * $row["Bilans"]),
            "price_gross_computed" => $priceSummary["total_gross"],
            "status" => 0,
        ]);


        $settlement = new PartnerSettlement([
            "user_id" => auth()->user()->id,
            "settlement_date" => $request->date,
            "sold_net" => $settlementInvoice->price_net_computed,
            "sold_gross" => $settlementInvoice->price_gross_computed,
            "return_net" => 0,
            "return_gross" => 0,
            "total_net" => 0,
            "total_gross" => 0,
        ]);

        $partner->partnerSettlements()->save($settlement);
        $settlement->documents()->save($settlementInvoice);
        $settlementInvoice->items()->saveMany($soldArray->pluck("item"));

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
    public function destroy(PartnerSettlement $partnerSettlement)
    {
        //
    }
}
