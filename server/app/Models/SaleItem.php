<?php

namespace App\Models;

use App\Casts\AsMoney;
use App\ValueObjects\Money;
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
        'cost',
        'price',
        'quantity',
    ];

    protected $hidden = [
        'cost_amount',
        'cost_currency',
        'price_amount',
        'price_currency',
    ];

    protected $casts = [
        'cost' => AsMoney::class,
        'price' => AsMoney::class,
    ];

    protected $appends = ['revenue', 'profit'];

    public function getRevenueAttribute(): Money
    {
        return new Money($this->price->amount * $this->quantity, $this->price->currency);
    }

    public function getProfitAttribute(): Money
    {
        return $this->revenue->subtract(
            new Money($this->cost->amount * $this->quantity, $this->cost->currency)
        );
    }
}
