<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'thumbnail',
    ];

    /**
     * Items that belong to this category.
     */
    public function items()
    {
        return $this->belongsToMany(Item::class, 'category_item');
    }

    /**
     * Direct child categories (subcategories).
     */
    public function children()
    {
        return $this->belongsToMany(
            Category::class,
            'category_category',
            'parent_id',
            'child_id'
        );
    }

    /**
     * Direct parent categories.
     */
    public function parents()
    {
        return $this->belongsToMany(
            Category::class,
            'category_category',
            'child_id',
            'parent_id'
        );
    }
}
