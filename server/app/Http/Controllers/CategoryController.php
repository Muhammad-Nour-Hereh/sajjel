<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\PatchCategoryRequest;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\UpdateThumbnailRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\Item;
use App\Services\ThumbnailService;
use Illuminate\Support\Facades\Request;

class CategoryController extends Controller
{

    public function __construct(protected ThumbnailService $thumbnailService)
    {
    }

    /**
     * Get all categories with full tree structure.
     */
    public function index(Request $request)
    {
        // Option 1: Get only root categories with full tree (recommended for hierarchy display)
        if ($request->boolean('roots_only', false)) {
            $categories = Category::getRootCategoriesWithTree();
        } else {
            // Option 2: Get all categories with their relationships loaded
            $categories = Category::getAllWithFullTree();
        }

        return $this->successResponse(CategoryResource::collection($categories));
    }

    /**
     * Show a specific category with its relationships.
     */
    public function show(Category $category, Request $request)
    {
        $relations = ['items'];

        // Always load children for tree structure
        if ($request->boolean('with_tree', true)) {
            $relations[] = 'children.children.children.children';
        }

        $category->load($relations);

        // Add level information
        Category::addLevelToTree($category, 0);

        return $this->successResponse(new CategoryResource($category));
    }

    /**
     * Store a new category.
     */
    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validatedWithCasts();
        $category = Category::create($data);

        return $this->createdResponse(new CategoryResource($category));
    }

    /**
     * Update a category (partial update).
     */
    public function patch(PatchCategoryRequest $request, Category $category)
    {
        $data = $request->validatedWithCasts();
        $category->update($data);

        return $this->successResponse(new CategoryResource($category));
    }

    /**
     * Delete a category.
     */
    public function destroy(Category $category)
    {
        // Check if category has children or items
        if ($category->hasChildren() || $category->items()->exists()) {
            return $this->unprocessableContentResponse(
                'Cannot delete category that has subcategories or items',
            );
        }

        $category->delete();

        return $this->noContentResponse();
    }

    public function updateThumbnail(Category $category, UpdateThumbnailRequest $request)
    {
        $file = $request->file('thumbnail');
        $path = $this->thumbnailService->replace($category->thumbnail, $file);
        $category->thumbnail = $path;
        $category->save();

        return $this->successResponse(['thumbnail' => $category->thumbnail]);
    }


    /**
     * Add an item to a category.
     */
    public function addItem(Category $category, Item $item)
    {
        if ($category->items()->where('item_id', $item->id)->exists()) {
            return $this->unprocessableContentResponse('Item is already in this category');
        }

        $category->items()->attach($item->id);

        return $this->successResponse([
            'message' => 'Item added to category successfully',
            'category' => new CategoryResource($category->load('items')),
        ]);
    }

    /**
     * Remove an item from a category.
     */
    public function removeItem(Category $category, Item $item)
    {
        if (!$category->items()->where('item_id', $item->id)->exists()) {
            return $this->unprocessableContentResponse('Item is not in this category');
        }

        $category->items()->detach($item->id);

        return $this->successResponse([
            'message' => 'Item removed from category successfully',
            'category' => new CategoryResource($category->load('items')),
        ]);
    }

    /**
     * Add a subcategory to a category (with cycle prevention).
     */
    public function addSubcategory(Category $parent, Category $child)
    {
        // Prevent self-reference
        if ($parent->id === $child->id) {
            return $this->unprocessableContentResponse('A category cannot be a subcategory of itself');
        }

        // Prevent cycles
        if ($parent->wouldCreateCycle($child->id)) {
            return $this->unprocessableContentResponse(
                'Adding this subcategory would create a circular reference'
            );
        }

        // Check if relationship already exists
        if ($parent->children()->where('child_id', $child->id)->exists()) {
            return $this->unprocessableContentResponse('Category is already a subcategory');
        }

        $parent->children()->attach($child->id);

        return $this->successResponse([
            'message' => 'Subcategory added successfully',
            'parent' => new CategoryResource($parent->load('children')),
        ]);
    }

    /**
     * Remove a subcategory from a category.
     */
    public function removeSubcategory(Category $parent, Category $child)
    {
        if (!$parent->children()->where('child_id', $child->id)->exists()) {
            return $this->unprocessableContentResponse('Category is not a subcategory');
        }

        $parent->children()->detach($child->id);

        return $this->successResponse([
            'message' => 'Subcategory removed successfully',
            'parent' => new CategoryResource($parent->load('children')),
        ]);
    }
}
