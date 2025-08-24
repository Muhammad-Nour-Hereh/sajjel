<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleItemResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'model' => $this->model,
            'note' => $this->note,
            // Pull sale-specific fields from pivot; fall back to item defaults if needed
            'quantity' => data_get($this, 'pivot.quantity', 1),
            'buy_price' => data_get($this, 'pivot.buy_price', $this->buy_price),
            'sell_price' => data_get($this, 'pivot.sell_price', $this->sell_price),
        ];
    }
}
