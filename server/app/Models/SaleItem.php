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

    // Changed from false to true since it's now a full entity
    public $timestamps = true;

    // Updated table name to follow Laravel conventions (plural)
    protected $table = 'sale_items';

    protected $fillable = [
        'sale_id',
        'item_id', // This will now be nullable
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

    // Relationships - now proper belongsTo instead of pivot relationships
    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    // Keep your existing computed attributes
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

    // Add some useful scopes for the nullable item_id
    public function scopeWithItem($query)
    {
        return $query->whereNotNull('item_id');
    }

    public function scopeWithoutItem($query)
    {
        return $query->whereNull('item_id');
    }

    // Helper method to check if this sale item has a registered item
    public function hasRegisteredItem(): bool
    {
        return !is_null($this->item_id);
    }
}