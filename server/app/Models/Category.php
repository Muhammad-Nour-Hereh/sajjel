<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

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

    /**
     * Get all root categories (categories with no parents) with full tree loaded.
     */
    public static function getRootCategoriesWithTree(): Collection
    {
        return static::whereDoesntHave('parents')
            ->with([
                'children' => function ($query) {
                    $query->with('children.children.children.children'); // Adjust depth as needed
                }
            ])
            ->with('items')
            ->get()
            ->each(function ($category) {
                static::addLevelToTree($category, 0);
            });
    }

    /**
     * Get all categories with their full tree structure loaded.
     */
    public static function getAllWithFullTree(): Collection
    {
        return static::with(['children.children.children.children.children', 'items'])
            ->get()
            ->each(function ($category) {
                static::addLevelToTree($category, 0);
            });
    }

    /**
     * Recursively add level property to category tree.
     */
    private static function addLevelToTree($category, int $level): void
    {
        $category->level = $level;

        if ($category->relationLoaded('children')) {
            $category->children->each(function ($child) use ($level) {
                static::addLevelToTree($child, $level + 1);
            });
        }
    }

    /**
     * Check if adding a subcategory would create a cycle.
     */
    public function wouldCreateCycle(int $childId): bool
    {
        if ($this->id === $childId) {
            return true;
        }

        return $this->isDescendantOf($childId);
    }

    /**
     * Check if this category is a descendant of the given category.
     */
    public function isDescendantOf(int $ancestorId): bool
    {
        return $this->getAllAncestors()->contains('id', $ancestorId);
    }

    /**
     * Get all ancestors of this category.
     */
    public function getAllAncestors(): Collection
    {
        $ancestors = collect();
        $currentParents = $this->parents;

        while ($currentParents->isNotEmpty()) {
            $ancestors = $ancestors->merge($currentParents);
            $currentParents = $currentParents->flatMap(function ($parent) {
                return $parent->parents;
            })->unique('id');
        }

        return $ancestors->unique('id');
    }

    /**
     * Get all descendants of this category.
     */
    public function getAllDescendants(): Collection
    {
        $descendants = collect();
        $currentChildren = $this->children;

        while ($currentChildren->isNotEmpty()) {
            $descendants = $descendants->merge($currentChildren);
            $currentChildren = $currentChildren->flatMap(function ($child) {
                return $child->children;
            })->unique('id');
        }

        return $descendants->unique('id');
    }

    /**
     * Check if this category has any children.
     */
    public function hasChildren(): bool
    {
        return $this->children()->exists();
    }

    /**
     * Check if this category has any parents.
     */
    public function hasParents(): bool
    {
        return $this->parents()->exists();
    }

    /**
     * Scope to get only root categories (no parents).
     */
    public function scopeRoots(Builder $query): Builder
    {
        return $query->whereDoesntHave('parents');
    }

    /**
     * Scope to get only leaf categories (no children).
     */
    public function scopeLeaves(Builder $query): Builder
    {
        return $query->whereDoesntHave('children');
    }
}