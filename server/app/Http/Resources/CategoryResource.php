<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'thumbnail' => $this->thumbnail,
            
            // Direct children (subcategories) - only loaded if relationship is loaded
            'children' => CategoryResource::collection($this->whenLoaded('children')),

            // Items in this category - only loaded if relationship is loaded  
            'items' => ItemResource::collection($this->whenLoaded('items')),

            // Counts for frontend optimization
            'children_count' => $this->when(
                $this->relationLoaded('children'),
                fn() => $this->children->count()
            ),
            'items_count' => $this->when(
                $this->relationLoaded('items'),
                fn() => $this->items->count()
            ),

            // Hierarchy level (useful for frontend rendering)
            'level' => $this->when(
                isset($this->level),
                $this->level ?? 0
            ),
        ];
    }
}
