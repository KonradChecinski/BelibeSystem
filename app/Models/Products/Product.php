<?php

namespace App\Models\Products;

use App\Helpers\Helper;
use App\Models\B2bCart;
use App\Models\Client\Client;
use App\Models\ClientOrderProduct;
use App\Models\OrderProduct;
use App\Models\ProductB2cStat;
use App\Models\Subiekt\Towar;
use App\Models\WarehouseDocumentProduct;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;
use Staudenmeir\EloquentHasManyDeep\HasOneDeep;

class Product extends Model
{
    use HasFactory, \Staudenmeir\EloquentHasManyDeep\HasRelationships;


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_model_color_id',
        'subiekt_id',
        'symbol',
        'name',
        'name_b2c',
        'quantity',
        'quantity_total',
        'product_unit_id',
        'product_size_id',
        'show_in_b2b',
        'show_in_b2c',
        'show_in_allegro',
        'show_in_empik',
        'show_in_subiekt',
    ];

    protected $appends = ["available", "available_b2c", "available_without_order_to_edit"];

    public function getAvailableAttribute()
    {
        $sum = $this->getAvailableQuantity();

        if ($sum < 0) {
            return 0;
        }
        return $sum;
    }

    public function getAvailableB2cAttribute()
    {
        $sum = $this->getAvailableQuantity();
        --$sum;

        if ($sum < 0) {
            return 0;
        }
        return $sum;
    }

    public function getAvailableWithoutOrderToEditAttribute()
    {
        if (Helper::isOrderToEdit()) {
            $orderId = Helper::getClientOrderToEditToB2b()?->id;
            $sum = $this->getAvailableQuantityWithoutClientOrder($orderId);
        } else {
            $sum = $this->getAvailableQuantity();

        }

        if ($sum < 0) {
            return 0;
        }
        return $sum;
    }

    public function color(): BelongsTo
    {
        return $this->belongsTo(ProductModelColor::class, "product_model_color_id", "id");
    }

    public function size(): BelongsTo
    {
        return $this->belongsTo(ProductSize::class, "product_size_id", "id");
    }

    public function images(): hasManyThrough
    {
        return $this->hasManyThrough(ProductImage::class, ProductModelColor::class, "id",
            "product_model_color_id", "product_model_color_id", "id");
    }

    public function barcodes(): HasMany
    {
        return $this->hasMany(ProductBarcode::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(ProductUnit::class, "product_unit_id", "id");
    }

    public function model(): HasOneDeep
    {
//        return $this->color->model();

        return $this->hasOneDeepFromReverse(
            (new ProductModel())->products()
        );
    }

    public function b2cStat(): HasOne
    {
        return $this->hasOne(ProductB2cStat::class);
    }


    public static function findBySubiektId($id)
    {

        if ($id == null) throw (new ModelNotFoundException)->setModel(Product::class);

//        return Product::Where("subiekt_id", "=", $id)->firstOrFail();
        return Product::Where("subiekt_id", "=", $id)->first();

    }

    public function inClientsCart(): HasMany
    {
        return $this->hasMany(B2bCart::class);
    }

    public function clientOrdersProducts(): HasMany
    {
        return $this->hasMany(ClientOrderProduct::class);
    }

    /**
     * @return int|mixed
     */
    public function getAvailableQuantity(): mixed
    {
        $baseQuantity = $this->quantity;
        $clientOrderProductsQuantity = ClientOrderProduct::query()->where("product_id", $this->id)->whereHas("orders", function (Builder $query) {
            $query->where("status", ">", 0)->where("status", "<=", 20);
        })->sum("quantity");

        $warehouseDocumentProductsQuantity = WarehouseDocumentProduct::query()->where("product_id", $this->id)->whereHas("warehouseDocument", function (Builder $query) {
            $query->whereHas("clientOrder", function (Builder $query) {
                $query->where("status", ">", 20)->where("status", "<", 100);
            });
        })->sum("quantity");

        $otherOrderProductsQuantity = OrderProduct::query()->where("product_id", $this->id)->whereHas("order", function (Builder $query) {
            $query->where("status", ">", 0)->where("status", "<", 100);
        })->sum("quantity");

        $sum = $baseQuantity - $clientOrderProductsQuantity - $otherOrderProductsQuantity - $warehouseDocumentProductsQuantity;
        return $sum;
    }

    /**
     * @return int|mixed
     */
    public function getAvailableQuantityWithoutWarehouseDocument(int $warehouseDocumentId): mixed
    {
        $baseQuantity = $this->quantity;
        $clientOrderProductsQuantity = ClientOrderProduct::query()->where("product_id", $this->id)->whereHas("orders", function (Builder $query) {
            $query->where("status", ">", 0)->where("status", "<=", 20);
        })->sum("quantity");

        $warehouseDocumentProductsQuantity = WarehouseDocumentProduct::query()->where("product_id", $this->id)->whereHas("warehouseDocument", function (Builder $query) use ($warehouseDocumentId) {
            $query->where("id", "!=", $warehouseDocumentId);
            $query->whereHas("clientOrder", function (Builder $query) {
                $query->where("status", ">", 20)->where("status", "<", 100);
            });
        })->sum("quantity");

        $otherOrderProductsQuantity = OrderProduct::query()->where("product_id", $this->id)->whereHas("order", function (Builder $query) {
            $query->where("status", ">", 0)->where("status", "<", 100);
        })->sum("quantity");

        $sum = $baseQuantity - $clientOrderProductsQuantity - $otherOrderProductsQuantity - $warehouseDocumentProductsQuantity;
        return $sum;
    }

    public function getAvailableQuantityWithoutClientOrder(int $clientOrderId): mixed
    {
        $baseQuantity = $this->quantity;
        $clientOrderProductsQuantity = ClientOrderProduct::query()->where("product_id", $this->id)->whereHas("orders", function (Builder $query) use ($clientOrderId) {
            $query
                ->where("status", ">", 0)
                ->where("status", "<=", 20)
                ->where("client_order_id", "!=", $clientOrderId);
        })->sum("quantity");

        $warehouseDocumentProductsQuantity = WarehouseDocumentProduct::query()->where("product_id", $this->id)->whereHas("warehouseDocument", function (Builder $query) {
            $query->whereHas("clientOrder", function (Builder $query) {
                $query->where("status", ">", 20)->where("status", "<", 100);
            });
        })->sum("quantity");

        $otherOrderProductsQuantity = OrderProduct::query()->where("product_id", $this->id)->whereHas("order", function (Builder $query) {
            $query->where("status", ">", 0)->where("status", "<", 100);
        })->sum("quantity");

        $sum = $baseQuantity - $clientOrderProductsQuantity - $otherOrderProductsQuantity - $warehouseDocumentProductsQuantity;
        return $sum;
    }


    //Subiekt
    public function towar(): HasOne
    {
        return $this->hasOne(Towar::class, "tw_Id", "subiekt_id");
    }
}
