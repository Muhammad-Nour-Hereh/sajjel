<?php
namespace App\Models;

use App\Casts\AsMoney;
use App\ValueObjects\Money;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SaleItem extends Model
{
    use SoftDeletes;

    public $timestamps = true;
    protected $table = 'sale_items';

    protected $fillable = [
        'sale_id',
        'item_id',
        'name',
        'cost',
        'price',
        'note',
        'quantity',
        'sort_order',
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
        'sort_order' => 'integer',
        'quantity' => 'integer'
    ];

    protected $appends = ['revenue', 'profit'];

    // Relationships
    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    // Computed attributes
    public function getRevenueAttribute(): Money
    {
        return $this->price->multiply($this->quantity);
    }

    public function getProfitAttribute(): Money
    {
        return $this->revenue->subtract(
            $this->cost->multiply($this->quantity)
        );
    }

    // Scopes
    public function scopeWithItem($query)
    {
        return $query->whereNotNull('item_id');
    }

    public function scopeWithoutItem($query)
    {
        return $query->whereNull('item_id');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    // Helper methods
    public function hasRegisteredItem(): bool
    {
        return !is_null($this->item_id);
    }

    // Boot method to auto-assign sort_order
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($saleItem) {
            if (is_null($saleItem->sort_order)) {
                $maxOrder = static::where('sale_id', $saleItem->sale_id)->max('sort_order') ?? 0;
                $saleItem->sort_order = $maxOrder + 1;
            }
        });
    }
}