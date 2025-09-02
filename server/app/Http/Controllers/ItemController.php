<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateItemThumbnailRequest;
use App\Services\ThumbnailService;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Http\Resources\ItemResource;
use App\Models\Item;

class ItemController extends Controller
{
    protected ThumbnailService $thumbnailService;

    public function __construct(ThumbnailService $thumbnailService)
    {
        $this->thumbnailService = $thumbnailService;
    }

    public function index()
    {
        $items = Item::all();
        return $this->successResponse(ItemResource::collection($items));
    }

    public function store(StoreItemRequest $request)
    {
        $data = $request->validatedWithCasts();
        $item = Item::create($data);
        return $this->createdResponse(new ItemResource($item));
    }

    public function show(Item $item)
    {
        return $this->successResponse(new ItemResource($item));
    }

    public function update(Item $item, UpdateItemRequest $request)
    {
        $data = $request->validatedWithCasts();
        $item->update($data);
        return $this->successResponse(new ItemResource($item));
    }

    public function updateThumbnail(Item $item, UpdateItemThumbnailRequest $request)
    {
        $file = $request->file('thumbnail');
        $path = $this->thumbnailService->replace($item->thumbnail, $file);
        $item->thumbnail = $path;
        $item->save();

        return $this->successResponse(['thumbnail' => $item->thumbnail]);
    }

    public function destroy(Item $item)
    {
        $item->delete();
        return $this->noContentResponse();
    }
}