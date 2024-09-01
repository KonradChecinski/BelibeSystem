<?php

namespace App\Helpers\Warehouse;

use App\Models\ClientOrder;
use App\Models\WarehouseDocument;

class Warehouse
{
    public static function transformClientOrderToWarehouseDocument(ClientOrder $clientOrder)
    {
//        dd($clientOrder, $clientOrder->orderProducts);


        $lastOrder = WarehouseDocument::query()->latest()->first();
        $lastNumber = $lastOrder?->number ?? 0;
        $lastNumber = (int)substr($lastNumber, -5);
        $lastNumber++;
        $number = "DM " . str_pad($lastNumber, 5, "0", STR_PAD_LEFT);

        $warehouseDocument = new WarehouseDocument([
            "number" => $number,
            "type" => 1,
            "status" => 10,
            "client_order_id" => $clientOrder->id,
            "total_quantity" => $clientOrder->total_quantity,
            "total_net" => $clientOrder->total_net,
            "total_gross" => $clientOrder->total_gross,
            "discount" => $clientOrder->discount,
            "discounted_total_net" => $clientOrder->discounted_total_net,
            "discounted_total_gross" => $clientOrder->discounted_total_gross,
            "comment" => $clientOrder->comment,
        ]);

        $warehouseDocument->save();

        foreach ($clientOrder->orderProducts as $orderProduct) {
            $warehouseDocument->warehouseDocumentProducts()->create([
                "product_id" => $orderProduct->product_id,
                "product_code" => null,
                "quantity" => $orderProduct->quantity,
                "original_price_net" => $orderProduct->original_price_net,
                "original_price_gross" => $orderProduct->original_price_gross,
                "price_net" => $orderProduct->price_net,
                "price_gross" => $orderProduct->price_gross,
                "currency" => $orderProduct->currency,
            ]);
        }
    }

}
