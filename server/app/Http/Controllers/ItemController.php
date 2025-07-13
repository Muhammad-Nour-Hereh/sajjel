<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateItemThumbnailRequest;
use App\Traits\Traits\Utils;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Item;

class ItemController extends Controller
{
    use Utils;
    public function index()
    {
        $items = Item::all();
        return $this->successResponse($items);
    }

    public function store(StoreItemRequest $request)
    {
        $data = $this->flattenPrices($request->validated());

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
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

        if ($request->hasFile('thumbnail')) {
            if ($item->thumbnail) {
                Storage::disk('public')->delete($item->thumbnail);
            }

            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $item->thumbnail = $path;
            $item->save();
        }

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
