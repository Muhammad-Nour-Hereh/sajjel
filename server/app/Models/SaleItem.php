<?php

namespace App\Models;

use App\Casts\AsMoney;
use App\ValueObjects\Money;
use App\ValueObjects\Currency;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

class SaleItem extends Pivot
{
    use SoftDeletes;

    public $timestamps = false;

    protected $table = 'sale_item';

    protected $fillable = [
        'sale_id',
        'item_id',
        'sell_price_amount',
        'sell_price_currency',
        'buy_price_amount',
        'buy_price_currency',
        'quantity',
    ];

    protected $hidden = [
        'buy_price_amount',
        'buy_price_currency',
        'sell_price_amount',
        'sell_price_currency',
    ];

    protected $appends = ['profit'];

    protected $casts = [
        'buy_price' => AsMoney::class,
        'sell_price' => AsMoney::class,
    ];

    public function getProfitAttribute()
    {
        // Convert both prices to USD for calculation
        $sellPriceUSD = $this->sell_price->toUSD();
        $buyPriceUSD = $this->buy_price->toUSD();

        // Calculate profit per unit, then multiply by quantity
        $profitPerUnit = $sellPriceUSD->subtract($buyPriceUSD);

        return new Money($profitPerUnit->amount * $this->quantity, Currency::USD);
    }
}