<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class Promotion extends Model
{
    use HasFactory;

    public const DISCOUNT_TYPE_PERCENT = 1;
    public const DISCOUNT_TYPE_AMOUNT = 2;
    public const DISCOUNT_TYPE_FIXED_PRICE = 3;

    protected $fillable = [
        'name',
        'description',
        'is_b2b',
        'is_b2c',
        'is_shoper',
        'is_allegro',
        'is_empik',
        'is_tiktok',
        'discount_type',
        'discount_value',
        'show_discount_on_invoice',
        'is_active',
        'starts_at',
        'ends_at',
    ];

    protected $casts = [
        'is_b2b' => 'boolean',
        'is_b2c' => 'boolean',
        'is_shoper' => 'boolean',
        'is_allegro' => 'boolean',
        'is_empik' => 'boolean',
        'is_tiktok' => 'boolean',
        'discount_type' => 'integer',
        'discount_value' => 'integer',
        'show_discount_on_invoice' => 'boolean',
        'is_active' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(PromotionItem::class);
    }

    /**
     * Scope dla aktualnie obowiązujących (aktywnych czasowo i włączonych) promocji.
     */
    public function scopeCurrentlyActive(Builder $query): Builder
    {
        $now = Carbon::now();

        return $query
            ->where('is_active', true)
            ->where(function (Builder $q) use ($now) {
                $q->whereNull('starts_at')
                    ->orWhere('starts_at', '<=', $now);
            })
            ->where(function (Builder $q) use ($now) {
                $q->whereNull('ends_at')
                    ->orWhere('ends_at', '>=', $now);
            });
    }

    /**
     * Scope dla aktywnych promocji B2B.
     */
    public function scopeActiveForB2b(Builder $query): Builder
    {
        return $query->currentlyActive()->where('is_b2b', true);
    }

    /**
     * Scope dla aktywnych promocji B2C.
     */
    public function scopeActiveForB2c(Builder $query): Builder
    {
        return $query->currentlyActive()->where('is_b2c', true);
    }

    /**
     * Oblicza cenę netto po promocji (w groszach) dla danej ceny bazowej netto (w groszach).
     */
    public function calculatePromotionalPrice(int $basePrice): int
    {
        if ($basePrice <= 0) {
            return 0;
        }

        switch ($this->discount_type) {
            case self::DISCOUNT_TYPE_PERCENT:
                // discount_value w setnych procenta (np. 2000 = 20%)
                $discounted = (int) round($basePrice - ($basePrice * ($this->discount_value / 10000)));
                return max(0, min($basePrice, $discounted));

            case self::DISCOUNT_TYPE_AMOUNT:
                // discount_value w groszach (np. 1000 = 10.00 zł)
                return max(0, min($basePrice, $basePrice - $this->discount_value));

            case self::DISCOUNT_TYPE_FIXED_PRICE:
                // discount_value jako stała cena w groszach
                return max(0, min($basePrice, $this->discount_value));

            default:
                return $basePrice;
        }
    }

    /**
     * Zwraca efektywny procent rabatu (w setnych procenta, np. 2000 = 20.00%) dla danej ceny bazowej.
     */
    public function calculateEffectiveDiscountPercent(int $basePrice): int
    {
        if ($basePrice <= 0) {
            return 0;
        }

        if ($this->discount_type === self::DISCOUNT_TYPE_PERCENT) {
            return max(0, min(10000, $this->discount_value));
        }

        $promoPrice = $this->calculatePromotionalPrice($basePrice);
        if ($promoPrice >= $basePrice) {
            return 0;
        }

        return (int) round((($basePrice - $promoPrice) / $basePrice) * 10000);
    }
}
