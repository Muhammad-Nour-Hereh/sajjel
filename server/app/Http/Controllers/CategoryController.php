<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\PatchCategoryRequest;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\UpdateThumbnailRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\ThumbnailService;

class CategoryController extends Controller
{

    public function __construct(protected ThumbnailService $thumbnailService)
    {
    }

    public function index()
    {
        $category = Category::all();
        return $this->successResponse(CategoryResource::collection($category));
    }

    public function show(Category $category)
    {
        return $this->successResponse(new CategoryResource($category));
    }

    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validatedWithCasts();
        $category = Category::create($data);
        return $this->createdResponse(new CategoryResource($category));
    }

    // public function update(UpdateCategoryRequest $request, Category $category)
    // {

    // }

    public function patch(PatchCategoryRequest $request, Category $category)
    {
        $data = $request->validatedWithCasts();
        $category->update($data);

        return $this->successResponse(new CategoryResource($category));
    }

    public function destroy(Category $category)
    {
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
}
