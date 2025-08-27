<?php

namespace App\Http\Controllers;

use App\Http\Requests\DateRangeRequest;
use App\Http\Requests\StoreSaleRequest;
use App\Http\Requests\UpdateSaleRequest;
use App\Http\Resources\SaleResource;
use App\Models\Sale;
use App\Services\SaleService;
use App\ValueObjects\Money;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    protected SaleService $saleService;

    public function __construct(SaleService $saleService)
    {
        $this->saleService = $saleService;
    }

    public function index(DateRangeRequest $request)
    {
        $query = Sale::with('saleItems.item')->latest();

        if ($request->filled('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->where('created_at', '<=', $request->end_date . ' 23:59:59');
        }

        $sales = $query->get();
        return $this->successResponse(SaleResource::collection($sales));
    }

    public function show($id)
    {
        $sale = Sale::with('saleItems.item')->find($id);

        if (!$sale) {
            return $this->notFoundResponse();
        }

        return $this->successResponse(new SaleResource($sale));
    }

    public function store(StoreSaleRequest $request)
    {
        $data = $request->validatedWithCasts();

        return DB::transaction(function () use ($data) {
            // calc totals
            $sale = Sale::create([
                'sold_at' => $data['sold_at'],
                'total_cost' => Money::Zero(),
                'total_revenue' => Money::Zero(),
            ]);

            $this->saleService->updateAttachedSaleItems($sale, $data['saleItems']);
            $this->saleService->updateSaleTotals($sale);

            return $this->createdResponse(new SaleResource($sale->load('saleItems.item')));
        });
    }

    public function update(UpdateSaleRequest $request, $id)
    {
        $sale = Sale::find($id);

        if (!$sale) {
            return $this->notFoundResponse();
        }

        $data = $request->validatedWithCasts();

        return DB::transaction(function () use ($sale, $data) {
            if (isset($data['items'])) {
                $this->saleService->updateAttachedSaleItems($sale, $data['items']);
                $this->saleService->updateSaleTotals($sale);
            }

            return $this->successResponse(new SaleResource($sale->load('saleItems.item')));
        });
    }

    public function destroy($id)
    {
        $sale = Sale::find($id);

        if (!$sale) {
            return $this->notFoundResponse();
        }

        $sale->delete();
        return $this->noContentResponse();
    }
}