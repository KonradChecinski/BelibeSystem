<?php

namespace App\Http\Controllers\System\Client;

use App\Helpers\Helper;
use App\Helpers\Warehouse\Warehouse;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateStatusClientOrderRequest;
use App\Jobs\FromSubiekt\GenerateInvoiceFromClientOrderInSubiekt;
use App\Jobs\ToSubiekt\ClientOrderCreateInSubiekt;
use App\Jobs\Warehouse\CreateWarehouseDocument;
use App\Models\Client\Client;
use App\Models\ClientOrder;
use App\Models\Products\Product;
use App\Notifications\b2b\OrderAcceptedClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class ClientOrderController extends Controller
{

    /**
     * Display the specified resource.
     */
    public function show(ClientOrder $clientOrder)
    {
        $clientOrder->load([
            "orderProducts",
            "payment",
            "delivery",
            "location",
            "location.country:id,name",
            "products:products.id,products.symbol,products.quantity,products.product_size_id,products.product_unit_id,products.product_model_color_id",
            "products.size:id,name",
            "products.unit:id,name",
            "productModels:product_models.id,product_models.name,product_models.symbol",
            "productModelColors" => function ($query) {
                $query->select("product_model_colors.id",
                    "product_model_colors.shortcut",
                    "product_model_colors.name",
                    "product_model_colors.product_model_id");
//                $query->withWhereHas("images", function ($query) {
//                    $query->where("type", 1);
//                    $query->where("order", 0);
//                    $query->select("product_model_color_id", "slug");
//                });
                $query->with(["images" => function ($query) {
                    $query->where("type", 1)
                        ->where("order", 0)
                        ->select("product_model_color_id", "slug");
                }]);
            },
        ]);
        $clientOrderModel = collect([$clientOrder]);


        return response()->json([
            "order" => $clientOrder,
            "orderProducts" => $clientOrder->orderProducts,
            "products" => $clientOrderModel->pluck("products")->flatten(),
            "productModels" => $clientOrderModel->pluck("productModels")->flatten()->unique("id")->values(),
            "productColors" => $clientOrderModel->pluck("productModelColors")->flatten()->unique("id")->values(),
            "payment" => $clientOrder->payment,
            "delivery" => $clientOrder->delivery,
            "location" => $clientOrder->location,
        ]);

    }

    public function update(Request $request, ClientOrder $clientOrder)
    {
        dd($request->all(), $clientOrder);

    }

    public function updateProduct(Request $request, ClientOrder $clientOrder, Product $product)
    {
        dd($request->all(), $clientOrder, $product);
    }

    public function updateStatus(UpdateStatusClientOrderRequest $request, ClientOrder $clientOrder)
    {
        if ($request->status === 20) {
            $oldStatus = $clientOrder->status;

            if ($oldStatus === 1) {
                $clientOrder->client->notify(new OrderAcceptedClient($clientOrder));
                CreateWarehouseDocument::dispatch($clientOrder);
            }
        }

        if ($request->status === 60) {
            $clientOrder->status = 60;
            $clientOrder->subiekt_number = null;
            $clientOrder->subiekt_added_at = null;
            $clientOrder->save();
            ClientOrderCreateInSubiekt::dispatch($clientOrder);
        }

        if ($request->status === 0) {
            $clientOrder->status = 0;
            $clientOrder->save();


            $clientOrder->warehouseDocument()->update([
                "status" => 0
            ]);
        }
    }

    public function createInvoice(ClientOrder $clientOrder)
    {
        if ($clientOrder->status === 100) {
            GenerateInvoiceFromClientOrderInSubiekt::dispatch($clientOrder);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Client $client)
    {
        $request->session()->put('client', $client);
//        dd(session()->all());
        return Redirect::route("b2b.main");
    }

    public function edit(Request $request, ClientOrder $clientOrder)
    {
        $client = $clientOrder->client;

        $request->session()->put('client', $client);
        $request->session()->put('clientOrderToEdit', $clientOrder);
//        dd(session()->all(), $clientOrder, $client);
        return Redirect::route("b2b.main");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $clientId = Helper::getClientIdToB2b();
        $request->session()->forget('client');
        $request->session()->forget('clientOrderToEdit');
        return Redirect::route("system.clients.client.edit", ["id" => $clientId]);
    }
}
