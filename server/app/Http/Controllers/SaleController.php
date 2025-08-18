<?php

namespace App\Http\Controllers;

use App\Http\Requests\DateRangeRequest;
use App\Http\Requests\StoreSaleRequest;
use App\Http\Requests\UpdateSaleRequest;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;


class SaleController extends Controller
{
    public function index(DateRangeRequest $request)
    {
        $query = Sale::with('items')->latest();

        if ($request->filled('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->where('created_at', '<=', $request->end_date . ' 23:59:59');
        }

        $sales = $query->get();
        return $this->successResponse($sales);
    }

    public function show($id)
    {
        $sale = Sale::with('items')->find($id);
        if (!$sale)
            return $this->notFoundResponse();
        return $this->successResponse($sale);
    }

    public function store(StoreSaleRequest $request)
    {
        $data = $request->validated();

        return DB::transaction(function () use ($data) {
            // Create the sale record
            $sale = Sale::create([
                'total_amount' => 0,
                'total_currency' => $data['items'][0]['sell_price']['currency'],
                'profit_amount' => 0,
                'profit_currency' => $data['items'][0]['sell_price']['currency'],
            ]);

            $total = 0;
            $profit = 0;

            foreach ($data['items'] as $item) {
                $sellAmount = $item['sell_price']['amount'];
                $sellCurrency = $item['sell_price']['currency'];

                $buyAmount = $item['buy_price']['amount'] ?? 0;
                $buyCurrency = $item['buy_price']['currency'] ?? $sellCurrency;

                $quantity = $item['quantity'];

                // Attach item with pivot data
                $sale->items()->attach($item['item_id'], [
                    'quantity' => $quantity,
                    'sell_price_amount' => $sellAmount,
                    'sell_price_currency' => $sellCurrency,
                    'buy_price_amount' => $buyAmount,
                    'buy_price_currency' => $buyCurrency,
                ]);

                $total += $sellAmount * $quantity;
                $profit += ($sellAmount - $buyAmount) * $quantity;
            }

            // Update totals
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
        if (!$sale)
            return $this->notFoundResponse();

        $data = $request->validated();

        return DB::transaction(function () use ($sale, $data) {
            if (isset($data['items'])) {

                $total = 0;
                $profit = 0;

                // Build an array to sync the items
                $syncData = [];

                foreach ($data['items'] as $item) {
                    $quantity = $item['quantity'] ?? 1;

                    $sellAmount = $item['sell_price']['amount'];
                    $sellCurrency = $item['sell_price']['currency'];

                    $buyAmount = $item['buy_price']['amount'] ?? 0;
                    $buyCurrency = $item['buy_price']['currency'] ?? $sellCurrency;

                    $syncData[$item['id']] = [
                        'quantity' => $quantity,
                        'sell_price_amount' => $sellAmount,
                        'sell_price_currency' => $sellCurrency,
                        'buy_price_amount' => $buyAmount,
                        'buy_price_currency' => $buyCurrency,
                    ];

                    $total += $sellAmount * $quantity;
                    $profit += ($sellAmount - $buyAmount) * $quantity;
                }

                // Sync avoids duplicates and automatically handles detach/attach
                $sale->items()->sync($syncData);

                $sale->update([
                    'total_amount' => $total,
                    'profit_amount' => $profit,
                ]);
            }

            return $this->successResponse(
                $sale->load([
                    'items' => fn($q) => $q->withPivot(
                        'quantity',
                        'sell_price_amount',
                        'sell_price_currency',
                        'buy_price_amount',
                        'buy_price_currency'
                    )
                ])
            );
        });
    }

    public function destroy($id)
    {
        $sale = Sale::find($id);
        if (!$sale)
            return $this->notFoundResponse();

        $sale->delete();
        return $this->noContentResponse();
    }
}
