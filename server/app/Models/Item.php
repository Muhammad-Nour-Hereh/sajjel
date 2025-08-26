<?php

namespace App\Models;

use App\Casts\AsMoney;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'model',
        'cost',
        'price',
        'thumbnail',
        'note',
    ];

    protected $hidden = [
        'cost_amount',
        'cost_currency',
        'price_amount',
        'price_currency',
        'deleted_at',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'cost' => AsMoney::class,
        'price' => AsMoney::class,
    ];
}