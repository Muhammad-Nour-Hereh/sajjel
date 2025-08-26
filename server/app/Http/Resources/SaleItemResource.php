<?php

namespace App\Http\Resources;

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
            'quantity' => data_get($this, 'pivot.quantity', 1),
            'cost' => data_get($this, 'pivot.cost', $this->cost),
            'price' => data_get($this, 'pivot.price', $this->price),
            'revenue' => data_get($this, 'pivot.revenue'),
            'profit' => data_get($this, 'pivot.profit'),
        ];
    }
}
