<?php

namespace App\Models;

use App\Casts\MoneyCast;
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

    protected $appends = ['date', 'time'];

    protected $hidden = [
        'total_amount',
        'total_currency',
        'profit_amount',
        'profit_currency',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $casts = [
        'total' => MoneyCast::class,
        'profit' => MoneyCast::class,
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
}
