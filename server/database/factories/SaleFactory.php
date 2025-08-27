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

                // Create SaleItem instead of attaching pivot
                $sale->saleItems()->create([
                    'item_id' => $item->id,
                    'cost' => $item->cost,
                    'price' => $item->price,
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

            // Optionally add some unregistered items (items without item_id)
            if (rand(1, 3) === 1) { // 33% chance
                $unregisteredQuantity = rand(1, 2);
                $unregisteredCost = Money::usd(rand(50, 200));
                $unregisteredPrice = Money::usd(rand(100, 300));

                $sale->saleItems()->create([
                    'item_id' => null, // Unregistered item
                    'cost' => $unregisteredCost,
                    'price' => $unregisteredPrice,
                    'quantity' => $unregisteredQuantity,
                ]);

                $itemTotalCost = Money::usd($unregisteredCost->amount * $unregisteredQuantity);
                $itemTotalRevenue = Money::usd($unregisteredPrice->amount * $unregisteredQuantity);

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

                // Create SaleItem instead of attaching pivot
                $sale->saleItems()->create([
                    'item_id' => $item->id,
                    'cost' => $item->cost,
                    'price' => $item->price,
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

    /**
     * Create a sale with only unregistered items
     */
    public function unregisteredItemsOnly(): static
    {
        return $this->afterCreating(function (Sale $sale) {
            $totalCostUSD = Money::Zero();
            $totalRevenueUSD = Money::Zero();

            // Create 2-4 unregistered items
            for ($i = 0; $i < rand(2, 4); $i++) {
                $quantity = rand(1, 3);
                $cost = Money::usd(rand(20, 150));
                $price = Money::usd(rand(50, 250));

                $sale->saleItems()->create([
                    'item_id' => null,
                    'cost' => $cost,
                    'price' => $price,
                    'quantity' => $quantity,
                ]);

                $itemTotalCost = Money::usd($cost->amount * $quantity);
                $itemTotalRevenue = Money::usd($price->amount * $quantity);

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