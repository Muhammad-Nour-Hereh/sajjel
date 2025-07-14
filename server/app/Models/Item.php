<?php

namespace App\Models;

use App\Traits\FindOrRespond;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use HasFactory, SoftDeletes, FindOrRespond;

    protected $fillable = [
        'name',
        'model',
        'buy_price_amount',
        'buy_price_currency',
        'sell_price_amount',
        'sell_price_currency',
        'thumbnail',
        'note',
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
}
