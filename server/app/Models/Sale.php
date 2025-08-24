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

    public function getProfitAttribute()
    {
        return [
            'amount' => (float) $this->profit_amount,
            'currency' => $this->profit_currency,
        ];
    }

    public function getTotalAttribute()
    {
        return [
            'amount' => (float) $this->total_amount,
            'currency' => $this->total_currency,
        ];
    }
}
