<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaleItem\PatchSaleItemRequest;
use App\Http\Requests\SaleItem\ReorderSaleItemRequest;
use App\Http\Requests\SaleItem\StoreSaleItemRequest;
use App\Http\Requests\SaleItem\UpdateSaleItemRequest;
use App\Http\Resources\SaleItemResource;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Services\SaleService;
use Illuminate\Support\Facades\DB;

class SaleItemController extends Controller
{
    protected SaleService $saleService;

    public function __construct(SaleService $saleService)
    {
        $this->saleService = $saleService;
    }

    public function index(Sale $sale)
    {
        $saleItems = $sale->saleItems()
            ->with('item')
            ->ordered()
            ->get();

        return $this->successResponse(SaleItemResource::collection($saleItems));
    }

    public function show(Sale $sale, SaleItem $saleItem)
    {
        // Ensure the sale item belongs to the sale
        if ($saleItem->sale_id !== $sale->id) {
            return $this->notFoundResponse();
        }

        return $this->successResponse(new SaleItemResource($saleItem->load('item')));
    }

    public function store(StoreSaleItemRequest $request, Sale $sale)
    {
        $data = $request->validatedWithCasts();

        return DB::transaction(function () use ($sale, $data) {
            $saleItem = $sale->saleItems()->create($data);
            $this->saleService->updateSaleTotals($sale);

            return $this->createdResponse(new SaleItemResource($saleItem->load('item')));
        });
    }

    public function update(UpdateSaleItemRequest $request, Sale $sale, SaleItem $saleItem)
    {
        // Ensure the sale item belongs to the sale
        if ($saleItem->sale_id !== $sale->id) {
            return $this->notFoundResponse();
        }

        $data = $request->validatedWithCasts();

        return DB::transaction(function () use ($saleItem, $sale, $data) {
            $saleItem->update($data);
            $this->saleService->updateSaleTotals($sale);

            return $this->successResponse(new SaleItemResource($saleItem->fresh()->load('item')));
        });
    }

    public function patch(PatchSaleItemRequest $request, Sale $sale, SaleItem $saleItem)
    {
        // Ensure the sale item belongs to the sale
        if ($saleItem->sale_id !== $sale->id) {
            return $this->notFoundResponse();
        }

        $data = $request->validatedWithCasts();

        return DB::transaction(function () use ($saleItem, $sale, $data) {
            $saleItem->update($data);

            // Only recalculate totals if financial fields changed
            if (collect($data)->keys()->intersect(['cost', 'price', 'quantity'])->isNotEmpty()) {
                $this->saleService->updateSaleTotals($sale);
            }

            return $this->successResponse(new SaleItemResource($saleItem->fresh()->load('item')));
        });
    }

    /**
     * Remove a sale item from a sale
     */
    public function destroy(Sale $sale, SaleItem $saleItem)
    {
        // Ensure the sale item belongs to the sale
        if ($saleItem->sale_id !== $sale->id) {
            return $this->notFoundResponse();
        }

        return DB::transaction(function () use ($saleItem, $sale) {
            $saleItem->delete();
            $this->saleService->updateSaleTotals($sale);

            return $this->noContentResponse();
        });
    }

    public function reorder(ReorderSaleItemRequest $request, Sale $sale)
    {
        $data = $request->validated();

        return DB::transaction(function () use ($sale, $data) {
            // Update sort_order for each item based on array position
            foreach ($data['item_ids'] as $index => $itemId) {
                SaleItem::where('id', $itemId)
                    ->where('sale_id', $sale->id)
                    ->update(['sort_order' => $index + 1]);
            }

            // Return the reordered items
            $saleItems = $sale->saleItems()
                ->with('item')
                ->ordered()
                ->get();

            return $this->successResponse([
                'message' => 'Sale items reordered successfully',
                'data' => SaleItemResource::collection($saleItems)
            ]);
        });
    }
}