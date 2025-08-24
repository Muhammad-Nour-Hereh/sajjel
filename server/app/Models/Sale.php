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

    protected $appends = ['date', 'time', 'total', 'profit'];

    protected $hidden = [
        'total_amount',
        'total_currency',
        'profit_amount',
        'profit_currency',
        'created_at',
        'updated_at',
        'deleted_at',
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
        $USD_LB_RATE = 89_500;

        $amount = $this->items->sum(function ($item) use ($USD_LB_RATE) {
            $sell_usd_amount = ($item->pivot->sell_price_currency == 'USD')
                ? $item->pivot->sell_price_amount
                : $item->pivot->sell_price_amount / $USD_LB_RATE;

            $buy_usd_amount = ($item->pivot->buy_price_currency == 'USD')
                ? $item->pivot->buy_price_amount
                : $item->pivot->buy_price_amount / $USD_LB_RATE;

            return ($sell_usd_amount - $buy_usd_amount) * $item->pivot->quantity;
        });

        return [
            'amount' => round($amount, 2),
            'currency' => 'USD',
        ];
    }

    public function getTotalAttribute()
    {
        $USD_LB_RATE = 89_500;
        $items = $this->items;
        $amount = $items->sum(
            function ($item) use ($USD_LB_RATE) {
                $buy_usd_amount = ($item->pivot->buy_price_currency == 'USD')
                    ? $item->pivot->buy_price_amount
                    : $item->pivot->buy_price_amount / $USD_LB_RATE;
                return $buy_usd_amount * $item->pivot->quantity;
            }
        );
        return [
            'amount' => round($amount, 2),
            'currency' => 'USD'
        ];
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
