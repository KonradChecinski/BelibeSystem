<?php

namespace App\Helpers\Warehouse;

use App\Models\ClientOrder;
use App\Models\WarehouseDocument;
use Illuminate\Support\Collection;

class Warehouse
{
    public static function transformClientOrderToWarehouseDocument(ClientOrder $clientOrder): WarehouseDocument
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
            "client_comment" => $clientOrder->client_comment,
            "user_comment" => $clientOrder->user_comment,
        ]);

        $warehouseDocument->save();

        foreach ($clientOrder->orderProducts as $orderProduct) {
            $warehouseDocument->warehouseDocumentProducts()->create([
                "type" => 1,
                "product_id" => $orderProduct->product_id,
                "product_code" => null,
                "quantity" => $orderProduct->quantity,
                "original_price_net" => $orderProduct->original_price_net,
                "original_price_gross" => $orderProduct->original_price_gross,
                "price_net" => $orderProduct->price_net,
                "price_gross" => $orderProduct->price_gross,
                "vat_rate" => $orderProduct->vat_rate,
                "currency" => $orderProduct->currency,
            ]);
        }
        return $warehouseDocument;
    }

    public static function sortProductsBySizeAndColor(Collection $products): Collection
    {
        $sizeOrder = ["one size", "xs", "s", "m", "l", "xl", "2xl", "3xl", "4xl",
            "5xl", "6xl", "7xl", "8xl", "9xl", "10xl", "1", "2", "3", "J", "U", "XXL", "98", "104", "110", "116", "122", "128", "134", "140", "146", "152", "158", "164"];

        // Mapujemy rozmiary na indeksy
        $sizeIndex = array_flip(array_map('strtolower', $sizeOrder));

        return $products->sortBy(function ($product) use ($sizeIndex) {
            $size = strtolower($product->size->name);
            $color = strtolower($product->color->shortcut);

            $sizeRank = $sizeIndex[$size] ?? PHP_INT_MAX;
//            dd($sizeIndex, $size, $sizeRank, $color, $product);

            // Sortujemy najpierw po rozmiarze, a potem po kolorze
            return [$sizeRank, $color];
        });
    }

    public static function sortItemsBySizeAndColor(Collection $items): Collection
    {
        $sizeOrder = ["one size", "xs", "s", "m", "l", "xl", "2xl", "3xl", "4xl",
            "5xl", "6xl", "7xl", "8xl", "9xl", "10xl", "1", "2", "3", "J", "U", "XXL", "98", "104", "110", "116", "122", "128", "134", "140", "146", "152", "158", "164"];

        // Mapujemy rozmiary na indeksy
        $sizeIndex = array_flip(array_map('strtolower', $sizeOrder));

        return $items->sortBy(function ($item) use ($sizeIndex) {
            $size = strtolower($item->product->size->name);
            $color = strtolower($item->product->color->shortcut);

            $sizeRank = $sizeIndex[$size] ?? PHP_INT_MAX;
//            dd($sizeIndex, $size, $sizeRank, $color, $product);

            // Sortujemy najpierw po rozmiarze, a potem po kolorze
            return [$sizeRank, $color];
        });
    }

}
