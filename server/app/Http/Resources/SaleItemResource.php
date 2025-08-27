<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SaleItemResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'item_id' => $this->item_id,
            'name' => $this->item?->name,
            'model' => $this->item?->model,
            'note' => $this->item?->note,
            'quantity' => $this->quantity,
            'cost' => $this->cost,
            'price' => $this->price,
            'revenue' => $this->revenue,
            'profit' => $this->profit,
        ];
    }
}
