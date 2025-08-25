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
        $query = Sale::with('items')->latest();

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
        $sale = Sale::with('items')->find($id);
        
        if (!$sale) {
            return $this->notFoundResponse();
        }

        return $this->successResponse(new SaleResource($sale));
    }

    public function store(StoreSaleRequest $request)
    {
        $data = $request->validatedWithCasts();

        return DB::transaction(function () use ($data) {
            // Create empty sale with currency from first item
            $initialCurrency = $data['items'][0]['sell_price']->currency;
            
            $sale = Sale::create([
                'total' => new Money(0, $initialCurrency),
                'profit' => new Money(0, $initialCurrency),
            ]);

            // Use SaleService to attach items
            $this->saleService->attachItems($sale, $data['items']);

            // Calculate totals & profit using Money objects
            $totals = $this->saleService->calculateTotals($data['items']);

            // Update sale totals
            $sale->update([
                'total' => $totals['total'],
                'profit' => $totals['profit'],
            ]);

            return $this->createdResponse(new SaleResource($sale->load('items')));
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
                $this->saleService->attachItems($sale, $data['items']);
                
                $totals = $this->saleService->calculateTotals($data['items']);
                
                $sale->update([
                    'total' => $totals['total'],
                    'profit' => $totals['profit'],
                ]);
            }

            return $this->successResponse(new SaleResource($sale->load('items')));
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