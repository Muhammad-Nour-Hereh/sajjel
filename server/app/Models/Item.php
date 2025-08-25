<?php

namespace App\Models;

use App\Casts\MoneyCast;
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

    protected $casts = [
        'buy_price' => MoneyCast::class,
        'sell_price' => MoneyCast::class,
    ];
}