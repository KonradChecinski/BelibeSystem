<?php

namespace App\Helpers\Warehouse;

use App\Models\Subiekt\Towar;

class WarehouseApp
{

    public static function getTowarQuantityInSubiektWarehouses(Towar|int $towar)
    {
        $suppliers = \App\Models\Warehouse::query()
            ->where('type', 1)
            ->get();

        $shops = \App\Models\Warehouse::query()
            ->where('type', 2)
            ->get();

        $otherWarehouses = \App\Models\Warehouse::query()
            ->where('type', 0)
            ->get();

        foreach ($suppliers as $supplier) {
            $supplier->quantity = $supplier->getQuantityFromSubiektWarehouse($towar);
        }

        foreach ($shops as $shop) {
            $shop->quantity = $shop->getQuantityFromSubiektWarehouse($towar);
        }

        foreach ($otherWarehouses as $otherWarehouse) {
            $otherWarehouse->quantity = $otherWarehouse->getQuantityFromSubiektWarehouse($towar);
        }

        $result = collect();

        $result->put('suppliers', $suppliers->map(fn($supplier) => $supplier->only(['symbol', 'name', 'quantity'])));
        $result->put('shops', $shops->map(fn($shop) => $shop->only(['symbol', 'name', 'quantity'])));
        $result->put('other', $otherWarehouses->map(fn($otherWarehouse) => $otherWarehouse->only(['symbol', 'name', 'quantity'])));
        dd($result);
        return $result;
    }

}
