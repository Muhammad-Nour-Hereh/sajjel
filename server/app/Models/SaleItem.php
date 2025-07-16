<?php

namespace App\Models;

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

    protected $appends = ['buy_price', 'sell_price'];

    public function getBuyPriceAttribute()
    {
        return [
            'amount' => (float) $this->buy_price_amount,
            'currency' => $this->buy_price_currency,
        ];
    }

    public function getSellPriceAttribute()
    {
        return [
            'amount' => (float) $this->sell_price_amount,
            'currency' => $this->sell_price_currency,
        ];
    }
    public function getProfitAttribute()
    {
        return ($this->sell_price_amount - $this->buy_price_amount) * $this->quantity;
    }
}
