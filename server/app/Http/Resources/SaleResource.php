<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'date' => $this->date,
            'time' => $this->time,
            'total_cost' => $this->total_cost,
            'total_revenue' => $this->total_revenue,
            'total_profit' => $this->total_profit,
            'items' => SaleItemResource::collection($this->whenLoaded('items')),
        ];
    }
}