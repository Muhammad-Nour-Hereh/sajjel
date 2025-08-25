<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateItemThumbnailRequest;
use App\Services\ThumbnailService;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
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
        return $this->successResponse($items);
    }

    public function store(StoreItemRequest $request)
    {
        $data = $request->validatedWithCasts(); // Now gets Money objects

        $item = Item::create($data); // Cast handles Money -> array conversion

        return $this->createdResponse($item);
    }

    public function show($id)
    {
        $item = Item::find($id);
        if (!$item)
            return $this->notFoundResponse();

        return $this->successResponse($item);
    }

    public function update(UpdateItemRequest $request, $id)
    {
        $item = Item::find($id);

        if (!$item) {
            return $this->notFoundResponse();
        }

        $data = $request->validatedWithCasts(); // Now gets Money objects

        $item->update($data); // Cast handles Money -> array conversion

        return $this->successResponse($item);
    }
    public function updateThumbnail(UpdateItemThumbnailRequest $request, $id)
    {
        $item = Item::find($id);
        if (!$item) {
            return $this->notFoundResponse();
        }

        $file = $request->file('thumbnail');
        $path = $this->thumbnailService->replace($item->thumbnail, $file);
        $item->thumbnail = $path;
        $item->save();

        return $this->successResponse(['thumbnail' => $item->thumbnail]);
    }

    public function destroy($id)
    {
        $item = Item::find($id);
        if (!$item)
            return $this->notFoundResponse();

        $item->delete();
        return $this->noContentResponse();
    }
}