<?php

namespace App\Jobs\partners;

use App\Helpers\Partners\PartnerExportFile;
use App\Helpers\Shoper\Shoper;
use App\Helpers\Subiekt\SubiektQueries;
use App\Models\B2bPayment;
use App\Models\Client\Client;
use App\Models\Partner;
use App\Models\PartnerExport;
use App\Models\Products\Price\ProductModelPrice;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\Products\ProductModelColor;
use App\Singleton\Subiekt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class CreateInvoiceCorrectionsFromPartnerSummaryFile implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1;
    public $backoff = 20;
    public $timeout = 60;

    private Partner $partner;
    private Collection $returned;
    private Client $client;
    private B2bPayment $payment;
    private int $warehouse_id;


    /**
     * Create a new job instance.
     */
    public function __construct(Partner $partner, Client $client, Collection $returned, B2bPayment $b2bPayment, int $warehouse_id)
    {
        $this->onQueue('sfera');
        $this->partner = $partner;
        $this->returned = $returned;
        $this->client = $client;
        $this->payment = $b2bPayment;
        $this->warehouse_id = $warehouse_id;
    }

    public function uniqueId(): string
    {
        return $this->partner->id . $this->client->id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $subiekt = app(Subiekt::class)->getInstance();
        $subiekt = $subiekt->connect();

        $subiekt->MagazynId = $this->warehouse_id;

        $invoicesToCorrection = collect();

        foreach ($this->returned as $item) {
            $item = (object)$item;
            $product = Product::query()->where("symbol", $item->Symbol)->firstOrFail();
            $queryResult = SubiektQueries::whatRemainInInvoiceAfterCorrections($this->warehouse_id, $product->subiekt_id, $this->client->subiekt_id);

//            dd($queryResult);
            $invoicesToCorrectionWithProduct = collect();
            $howManyToCorrection = $item->Bilans * (-1);
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
                        'item_id' => $invoice->ob_DokMagLp,
                        'toCorrect' => $toCorrectNow,
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


        $groupedInvoicesToCorrections = $invoicesToCorrection->flatMap(function ($item) {
            return $item['corrections']->map(function ($correction) {
                return [
                    'dok_Id' => $correction->dok_Id,
                    'tw_Id' => $correction->tw_Id,
                    'item_id' => $correction->item_id,
                    'toCorrect' => $correction->toCorrect,
                ];
            });
        })->groupBy('dok_Id')->map(function ($group) {
            return $group->map(function ($correction) {
                return [
                    'tw_Id' => $correction['tw_Id'],
                    'item_id' => $correction['item_id'],
                    'toCorrect' => $correction['toCorrect'],
                ];
            })->values();
        });


//        dd($groupedInvoicesToCorrections);

        foreach ($groupedInvoicesToCorrections as $invoice_id => $invoiceItemsToCorrection) {
            $kfs = $subiekt->SuDokumentyManager->DodajKFS();
            $kfs->NaPodstawie($invoice_id);

            foreach ($invoiceItemsToCorrection as $invoiceItemToCorrection) {
                $invoiceItemToCorrection = (object)$invoiceItemToCorrection;
                $pozycja = $kfs->Pozycje->Element($invoiceItemToCorrection->item_id);
                $pozycja->IloscJmPoKorekcie = (int)((int)$pozycja->IloscJm - $invoiceItemToCorrection->toCorrect);
                $pozycja->PrzyczynaKorektyId = 7;

                //pkr_Id	pkr_Nazwa
                //1	Pomyłka w cenie
                //2	Pomyłka w ilości sprzedanej
                //3	Pomyłka w stawce podatku
                //4	Uszkodzony towar
                //5	Reklamacja
                //6	Przyznanie rabatu za przekroczenie progu obrotu
                //7	zwrot towaru
            }


            $kfs->PlatnoscKredytKwota = $kfs->KwotaDoZaplaty;
            $kfs->PlatnoscKredytId = 17;

            $date = date("Y-m-d H:i:s");
            $kfs->PoleWlasne["Czas"] = $date;

//            $kfs->Wyswietl();
            $kfs->Zapisz();

//            $kfs->PlatnoscKredytId = 17;
//            $kfs->Zapisz();
        }

        $subiekt->MagazynId = 1;
    }
}
