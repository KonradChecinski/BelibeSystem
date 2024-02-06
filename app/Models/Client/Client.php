<?php

namespace App\Models\Client;

use App\Models\B2bCountry;
use App\Models\B2bIndustry;
use App\Models\B2bPayment;
use App\Models\B2bSourceOfAcquisition;
use App\Models\B2bStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'subiekt_id',
        'name',
        'nip',
        'country_id',
        'city',
        'street',
        'building_number',
        'apartment_number',
        'postal_code',
        'phone',
        'email',
        'status_id',
        'priority',
        'source_of_acquisition_id',
        'user_id',
        'payment_id',
        'industry_id',
        'blacklist',
    ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(B2bCountry::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(B2bStatus::class);
    }

    public function sourceOfAcquisition(): BelongsTo
    {
        return $this->belongsTo(B2bSourceOfAcquisition::class);
    }

    public function accountManager(): BelongsTo
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(B2bPayment::class);
    }

    public function industry(): BelongsTo
    {
        return $this->belongsTo(B2bIndustry::class);
    }




//    public function colorsWithImages(): HasMany
//    {
//        return $this->hasMany(ProductModelColor::class)->with("images");
//    }
//
//    public function group(): BelongsTo
//    {
//        return $this->belongsTo(ProductGroup::class, "product_group_id");
//    }
//
//    public function products(): HasManyThrough
//    {
//        return $this->hasManyThrough(Product::class, ProductModelColor::class)->with(['barcodes', 'size', 'unit']);
//    }
//
//    public function prices(): HasOne
//    {
//        return $this->hasOne(ProductModelPrice::class);
//    }

}
