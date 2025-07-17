<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSaleRequest;
use App\Http\Requests\UpdateSaleRequest;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with('items')->latest()->get();
        return $this->successResponse($sales);
    }

    public function show($id)
    {
        $sale = Sale::with('items')->find($id);
        if (!$sale) return $this->notFoundResponse();
        return $this->successResponse($sale);
    }

    public function store(StoreSaleRequest $request)
    {
        $data = $request->validated();

        return DB::transaction(function () use ($data) {
            $sale = Sale::create([
                'total_amount' => 0, // will be updated
                'total_currency' => $data['items'][0]['sell_price_currency'],
                'profit_amount' => 0,
                'profit_currency' => $data['items'][0]['sell_price_currency'],
            ]);

            $total = 0;
            $profit = 0;

            foreach ($data['items'] as $item) {
                $sale->items()->attach($item['item_id'], [
                    'quantity' => $item['quantity'],
                    'sell_price_amount' => $item['sell_price_amount'],
                    'sell_price_currency' => $item['sell_price_currency'],
                    'buy_price_amount' => $item['buy_price_amount'],
                    'buy_price_currency' => $item['buy_price_currency'],
                ]);

                $total += $item['sell_price_amount'] * $item['quantity'];
                $profit += ($item['sell_price_amount'] - $item['buy_price_amount']) * $item['quantity'];
            }

            $sale->update([
                'total_amount' => $total,
                'profit_amount' => $profit,
            ]);

            return $this->createdResponse($sale->load('items'));
        });
    }

    public function update(UpdateSaleRequest $request, $id)
    {
        $sale = Sale::find($id);
        if (!$sale) return $this->notFoundResponse();

        $data = $request->validated();

        return DB::transaction(function () use ($sale, $data) {
            if (isset($data['items'])) {
                $sale->items()->detach();

                $total = 0;
                $profit = 0;

                foreach ($data['items'] as $item) {
                    $sale->items()->attach($item['item_id'], [
                        'quantity' => $item['quantity'],
                        'sell_price_amount' => $item['sell_price_amount'],
                        'sell_price_currency' => $item['sell_price_currency'],
                        'buy_price_amount' => $item['buy_price_amount'],
                        'buy_price_currency' => $item['buy_price_currency'],
                    ]);

                    $total += $item['sell_price_amount'] * $item['quantity'];
                    $profit += ($item['sell_price_amount'] - $item['buy_price_amount']) * $item['quantity'];
                }

                $sale->update([
                    'total_amount' => $total,
                    'profit_amount' => $profit,
                ]);
            }

            return $this->successResponse($sale->load('items'));
        });
    }

    public function destroy($id)
    {
        $sale = Sale::find($id);
        if (!$sale) return $this->notFoundResponse();

        $sale->delete();
        return $this->noContentResponse();
    }
}
