<?php

namespace App\Models;

use App\Casts\AsMoney;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'total_cost',
        'total_revenue',
        'sold_at',
    ];

    protected $dates = ['sold_at'];

    protected $hidden = [
        'total_cost_amount',
        'total_cost_currency',
        'total_revenue_amount',
        'total_revenue_currency',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $casts = [
        'sold_at' => 'datetime',
        'total_cost' => AsMoney::class,
        'total_revenue' => AsMoney::class,
    ];

    protected $appends = ['total_profit', 'date', 'time'];

    public function getTotalProfitAttribute()
    {
        return $this->total_revenue->subtract($this->total_cost);
    }

    public function getDateAttribute()
    {
        return $this->sold_at?->toDateString();
    }

    public function getTimeAttribute()
    {
        return $this->sold_at?->toTimeString();
    }

    public function items()
    {
        return $this->belongsToMany(Item::class, 'sale_item')
            ->using(SaleItem::class)
            ->withPivot([
                'cost_amount',
                'cost_currency',
                'price_amount',
                'price_currency',
                'quantity',
            ]);
    }
}