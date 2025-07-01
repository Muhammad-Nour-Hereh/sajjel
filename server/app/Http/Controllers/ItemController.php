<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Item;

class ItemController extends Controller {

    public function index() {
        $items = Item::all();
        return $this->successResponse($items);
    }

    public function store(StoreItemRequest $request) {
        Item::create($request->validated());
        return $this->createdResponse();
    }

    public function show($id) {
        $item = Item::find($id);
        if (!$item) return $this->notFoundResponse();
        return $this->successResponse($item);
    }

    public function update(UpdateItemRequest $request, $id) {
        $item = Item::find($id);
        if (!$item) return $this->notFoundResponse();

        $item->update($request->validated());
        return $this->noContentResponse();
    }

    public function destroy($id) {
        $item = Item::find($id);
        if (!$item) return $this->notFoundResponse();

        $item->delete();
        return $this->noContentResponse();
    }
}
