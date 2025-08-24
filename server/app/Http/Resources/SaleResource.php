<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'date' => $this->date,
            'time' => $this->time,
            'total' => $this->total,
            'profit' => $this->profit,
            'items' => SaleItemResource::collection($this->whenLoaded('items')),
        ];
    }
}