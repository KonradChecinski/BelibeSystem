<?php

namespace App\Http\Controllers;

use App\Helpers\Helper;
use App\Models\Products\Product;
use App\Models\Products\ProductBarcode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\HeadingRowImport;
use Spatie\SimpleExcel\SimpleExcelReader;

class ImportItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("B2B/ImportItems", [

        ]);
    }

    /**
     * Get the header of the import file.
     */
    public function getHeaderFromFile(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv,txt',
        ]);
        $file = $request->file('file');
        $headers = Excel::toCollection(null, $file);
//        $collection = Excel::toCollection(null, $file->getPathname());
//        $rows = $collection->first(); // arkusz nr 1
//        $firstRow = $rows->skip(1)->first();
        $headers = $headers->first()[0];
        $filteredHeaders = $headers->filter(fn($value) => is_string($value))->values();
//        return redirect()
//            ->route('b2b.import.items.step2') // Nazwa trasy dla kroku 2
//            ->withInput(); // Przekazuje dane wejściowe

        return Inertia::render('B2B/ImportItems', [
            'headersFromFile' => $filteredHeaders,
//            'firstRow' => $firstRow,
        ]);
    }

    /**
     * Get the items from the import file.
     */
    public function getItemsFromFile(Request $request)
    {
//        dd($request->all());
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:xlsx,xls,csv,txt',
            'identification' => 'required|numeric|in:1,2',
            'selectedHeaders' => 'required|array',
            'selectedHeaders.symbol' => 'nullable|string|required_if:identification,1',
            'selectedHeaders.ean' => 'nullable|string|required_if:identification,2',
            'selectedHeaders.quantity' => 'required|string',
        ]);

        if ($validator->fails()) {
            return Inertia::render('B2B/ImportItems', [
                'errors' => $validator->errors(),
                'data' => $request->all(),
            ]);
        }


//        dd($request->selectedHeaders);
        $file = $request->file('file');

        $selectedHeaders = $request->selectedHeaders;
        $identification = (int)$request->identification;


        $selectedHeaders2 = [];
        if ($identification == 1) {
            $selectedHeaders2 = [
                'symbol' => $selectedHeaders['symbol'],
                'quantity' => $selectedHeaders['quantity'],
            ];
        } elseif ($identification == 2) {
            $selectedHeaders2 = [
                'ean' => $selectedHeaders['ean'],
                'quantity' => $selectedHeaders['quantity'],
            ];
        }
//        dd($selectedHeaders2);


        $collection = Excel::toCollection(null, $file->getPathname());

        // Pobieramy pierwszą stronę (sheet)
        $sheet = $collection->first();

        // Przekształcamy dane tak, by pierwszy wiersz był nagłówkiem
        $headers = $sheet->first()->toArray(); // np. ['nazwa', 'cena']
        $dataRows = $sheet->slice(1); // reszta danych

        $finalData = $dataRows->map(function ($row) use ($headers) {
            return collect($headers)->combine($row);
        });
//        dd($finalData);
        $items = collect();
        foreach ($finalData as $row) {
            $item = [];
            $product = null;

            //Produkt
            if ($identification == 1) {
//                $item['symbol'] = $row[$selectedHeaders2['symbol']];
                $product = Product::query()->where('symbol', $row[$selectedHeaders2['symbol']])->first();
                if (!$product) {
                    return Inertia::render('B2B/ImportItems', [
                        'errors' => [
                            'product' => ['Nie znaleziono produktu o symbolu: ' . $row[$selectedHeaders2['symbol']]],
                        ],
                        'data' => $request->all(),
                    ]);
                }

            } elseif ($identification == 2) {
//                $item['ean'] = $row[$selectedHeaders2['ean']];
                $barcode = ProductBarcode::query()->where("barcode", $row[$selectedHeaders2['ean']])->first();
                if (!$barcode) {
                    return Inertia::render('B2B/ImportItems', [
                        'errors' => [
                            'product' => ['Nie znaleziono produktu o kodzie EAN: ' . $row[$selectedHeaders2['ean']]],
                        ],
                        'data' => $request->all(),
                    ]);
                }
                $product = $barcode->product;
            }
            $product->load([
                'size:id,name',
                'model:product_models.id,product_models.symbol,product_models.name',
//                'color:id,product_model_id,name,shortcut',
                'color' => function ($query) {
                    $query->select("product_model_colors.id",
                        "product_model_colors.shortcut",
                        "product_model_colors.name",
                        "product_model_colors.product_model_id");
                    $query->with("images", function ($query) {
                        $query->where("type", 1);
                        $query->where("order", 0);
                        $query->select("product_model_color_id", "slug");
                    });
                },
            ]);
            $product->setAppends(['available_without_order_to_edit']);
            $product = $product->only(['id', 'symbol', 'available_without_order_to_edit', 'size', 'model', 'color']);
            $item['product'] = $product;


            //Ilość
            $quantity = $row[$selectedHeaders2['quantity']];
            if (!$quantity || $quantity < 0) {

                return Inertia::render('B2B/ImportItems', [
                    'errors' => [
                        'quantity' => ['Nieprawidłowa ilość: ' . $quantity . ' dla produktu: ' .
                            ($identification === 1 ? $row[$selectedHeaders2['symbol']] : $row[$selectedHeaders2['ean']]) . '. Ilość musi być większa od 0.'],
                    ],
                    'data' => $request->all(),
                ]);
            }
            $item['quantity'] = $quantity;
            $items->push($item);
        }
//        dd($items);
        return Inertia::render('B2B/ImportItems', [
            'itemsFromFile' => $items,
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
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array',
            'items.*.product.id' => 'required|exists:products,id',
            'items.*.quantity' => [
                'required',
                'numeric',
                'min:0',
                function ($attribute, $value, $fail) use ($request) {
                    // Wyciągnięcie indeksu elementu z nazwy atrybutu
                    preg_match('/items\.(\d+)\.quantity/', $attribute, $matches);
                    $index = $matches[1] ?? null;

                    if ($index !== null) {
                        // Pobranie ID produktu z odpowiedniego indeksu
                        $productId = $request->input("items.{$index}.product.id");
                        $product = \App\Models\Products\Product::find($productId);

                        if ($product && $value > $product->available_without_order_to_edit) {
                            $fail("Ilość dla produktu {$product->symbol} nie może przekraczać dostępnej liczby: {$product->available_without_order_to_edit}.");
                        }
                    } else {
                        $fail("Nie można zweryfikować ilości, ponieważ indeks elementu jest nieprawidłowy.");
                    }
                },
            ],
        ]);

        if ($validator->fails()) {
            return Inertia::render('B2B/ImportItems', [
                'errors' => $validator->errors(),
                'data' => $request->all(),
            ]);
        }
        $items = $validator->validated()["items"];
//        dd($items);

        $cartService = app()->make(\App\Services\CartService::class);
        $client = Helper::getClientToB2b();

        $cartService->clearCart($client);

        foreach ($items as $item) {
            $product = Product::find($item['product']['id']);
            $quantity = $item['quantity'];
            $cartService->addOrUpdateProduct($client, $product, $quantity);
        }
        return redirect()->route('b2b.cart')->with([
            'success' => 'Produkty zostały dodane do koszyka.',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
