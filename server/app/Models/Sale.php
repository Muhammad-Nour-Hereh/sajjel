<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class Sale extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'total_amount',
        'total_currency',
        'profit_amount',
        'profit_currency',
    ];

    protected $appends = ['date', 'time', 'buy_price', 'sell_price'];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
        'buy_price_amount',
        'buy_price_currency',
        'sell_price_amount',
        'sell_price_currency',
    ];

    public function getDateAttribute()
    {
        return Carbon::parse($this->created_at)->toDateString();
    }

    public function getTimeAttribute()
    {
        return Carbon::parse($this->created_at)->toTimeString();
    }

    public function getProfitAttribute()
    {
        return ($this->sell_price_amount - $this->buy_price_amount) * $this->quantity;
    }

    public function items()
    {
        return $this->belongsToMany(Item::class, 'sale_item')
            ->using(SaleItem::class)
            ->withPivot([
                'sell_price_amount',
                'sell_price_currency',
                'buy_price_amount',
                'buy_price_currency',
                'quantity',
            ]);
    }

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
