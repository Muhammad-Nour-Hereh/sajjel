<?php

namespace Database\Factories;

use App\Models\Sale;
use App\Models\Item;
use App\ValueObjects\Money;
use Illuminate\Database\Eloquent\Factories\Factory;

class SaleFactory extends Factory
{
    protected $model = Sale::class;

    public function definition(): array
    {
        return [
            'total_cost' => Money::Zero(),
            'total_revenue' => Money::Zero(),
            'sold_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Sale $sale) {
            $items = Item::inRandomOrder()->take(rand(1, 5))->get();

            // Filter out items that don't have both cost and price
            $validItems = $items->filter(function ($item) {
                return $item->cost !== null && $item->price !== null;
            });

            if ($validItems->isEmpty()) {
                // If no valid items, create one with default values
                $defaultItem = Item::factory()->create([
                    'cost' => Money::usd(100),
                    'price' => Money::usd(150),
                ]);
                $validItems = collect([$defaultItem]);
            }

            $totalCostUSD = Money::Zero();
            $totalRevenueUSD = Money::Zero();

            foreach ($validItems as $item) {
                $quantity = rand(1, 3);

                // Double check the item has cost and price
                if (!$item->cost || !$item->price) {
                    continue;
                }

                // Attach the item to the sale with pivot data
                $sale->items()->attach($item->id, [
                    'cost_amount' => $item->cost->amount,
                    'cost_currency' => $item->cost->currency->value,
                    'price_amount' => $item->price->amount,
                    'price_currency' => $item->price->currency->value,
                    'quantity' => $quantity,
                ]);

                // Calculate totals in USD for consistency
                $itemCostUSD = $item->cost->toUSD();
                $itemPriceUSD = $item->price->toUSD();

                $itemTotalCost = Money::usd($itemCostUSD->amount * $quantity);
                $itemTotalRevenue = Money::usd($itemPriceUSD->amount * $quantity);

                $totalCostUSD = $totalCostUSD->add($itemTotalCost);
                $totalRevenueUSD = $totalRevenueUSD->add($itemTotalRevenue);
            }

            // Update the sale with calculated totals
            $sale->update([
                'total_cost' => $totalCostUSD,
                'total_revenue' => $totalRevenueUSD,
            ]);
        });
    }

    /**
     * Create a sale with mixed currencies
     */
    public function mixedCurrencies(): static
    {
        return $this->afterCreating(function (Sale $sale) {
            // Create some USD and LBP items specifically for this sale
            $usdItems = Item::factory()->usd()->count(2)->create();
            $lbpItems = Item::factory()->lbp()->count(2)->create();

            $items = $usdItems->merge($lbpItems);

            $totalCostUSD = Money::Zero();
            $totalRevenueUSD = Money::Zero();

            foreach ($items as $item) {
                $quantity = rand(1, 2);

                $sale->items()->attach($item->id, [
                    'cost_amount' => $item->cost->amount,
                    'cost_currency' => $item->cost->currency->value,
                    'price_amount' => $item->price->amount,
                    'price_currency' => $item->price->currency->value,
                    'quantity' => $quantity,
                ]);

                $itemCostUSD = $item->cost->toUSD();
                $itemPriceUSD = $item->price->toUSD();

                $itemTotalCost = Money::usd($itemCostUSD->amount * $quantity);
                $itemTotalRevenue = Money::usd($itemPriceUSD->amount * $quantity);

                $totalCostUSD = $totalCostUSD->add($itemTotalCost);
                $totalRevenueUSD = $totalRevenueUSD->add($itemTotalRevenue);
            }

            $sale->update([
                'total_cost' => $totalCostUSD,
                'total_revenue' => $totalRevenueUSD,
            ]);
        });
    }
}