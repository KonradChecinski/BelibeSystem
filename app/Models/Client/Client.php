<?php

namespace App\Models\Client;

use App\Models\B2bCart;
use App\Models\B2bCountry;
use App\Models\B2bIndustry;
use App\Models\B2bPayment;
use App\Models\B2bSourceOfAcquisition;
use App\Models\B2bStatus;
use App\Models\ClientActivity;
use App\Models\ClientDiscount;
use App\Models\ClientInvoice;
use App\Models\ClientLocation;
use App\Models\ClientNote;
use App\Models\ClientSettlement;
use App\Models\SubiektObligation;
use App\Models\ClientOrder;
use App\Models\ClientRecipient;
use App\Models\SubiektReceivable;
use App\Models\ClientTask;
use App\Models\Products\Product;
use App\Models\Products\ProductModel;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

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
        'newsletter',
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

    public function payments(): BelongsToMany
    {
        return $this->belongsToMany(B2bPayment::class)->as('discount')->withPivot(["discount", "discount_value"])->withTimestamps();
    }

    public function industry(): BelongsTo
    {
        return $this->belongsTo(B2bIndustry::class);
    }


    public function activities(): HasMany
    {
        return $this->hasMany(ClientActivity::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(ClientTask::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(ClientNote::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(ClientLocation::class);
    }

    public function discounts(): HasMany
    {
        return $this->hasMany(ClientDiscount::class);
    }

    public function clientUsers(): HasMany
    {
        return $this->hasMany(ClientUser::class);
    }

    public function recipient(): HasOne
    {
        return $this->hasOne(ClientRecipient::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(ClientOrder::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(ClientInvoice::class);
    }

    public function receivables(): HasMany
    {
//        return $this->hasMany(SubiektReceivable::class, "nzf_IdObiektu", "subiekt_id")->orderByDesc("nzf_Data");
        return $this->hasMany(ClientSettlement::class)->where("type", 1)->orderByDesc("datetime");
    }

    public function obligations(): HasMany
    {
//        return $this->hasMany(SubiektObligation::class, "nzf_IdObiektu", "subiekt_id")->orderByDesc("nzf_Data");
        return $this->hasMany(ClientSettlement::class)->where("type", 2)->orderByDesc("datetime");
    }

    public function settlements()
    {
        return [
            "receivables" => $this->receivables,
            "obligations" => $this->obligations
        ];
    }

    public function favorites(): BelongsToMany
    {
        return $this->belongsToMany(ProductModel::class, "favorite_product_model")->withTimestamps();
    }

    public function cart(): HasMany
    {
        return $this->hasMany(B2bCart::class);
    }


}
