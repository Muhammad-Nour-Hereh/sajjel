<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Item;

class ItemController extends Controller
{

    public function index()
    {
        $items = Item::all();
        return $this->successResponse($items);
    }

    public function store(StoreItemRequest $request)
    {
        $data = $this->flattenPrices($request->validated());
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
        if (!$item)
            return $this->notFoundResponse();

        $data = $this->flattenPrices($request->validated());
        $item->update($data);
        return $this->noContentResponse();
    }

    public function destroy($id)
    {
        $item = Item::find($id);
        if (!$item)
            return $this->notFoundResponse();

        $item->delete();
        return $this->noContentResponse();
    }

    protected function flattenPrices(array $data): array
    {
        if (isset($data['buy_price']) && is_array($data['buy_price'])) {
            $data['buy_price_amount'] = $data['buy_price']['amount'] ?? 0;
            $data['buy_price_currency'] = $data['buy_price']['currency'] ?? 'USD';
        }

        if (isset($data['sell_price']) && is_array($data['sell_price'])) {
            $data['sell_price_amount'] = $data['sell_price']['amount'] ?? 0;
            $data['sell_price_currency'] = $data['sell_price']['currency'] ?? 'USD';
        }

        return $data;
    }
}
