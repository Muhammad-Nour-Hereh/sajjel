<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateItemThumbnailRequest;
use App\Services\ThumbnailService;
use App\Traits\Traits\Utils;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Item;

class ItemController extends Controller
{
    use Utils;

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
        $data = $this->flattenPrices($request->validated());

        $file = $request->file('thumbnail');
        if ($file) {
            $data['thumbnail'] = $this->thumbnailService->replace(null, $file);
        }

        Item::create($data);

        return $this->createdResponse();
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

        $data = $this->flattenPrices($request->validated());

        $item->update($data);

        return $this->noContentResponse();
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
