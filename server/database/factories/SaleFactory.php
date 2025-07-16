<?php

namespace Database\Factories;

use App\Models\Sale;
use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

class SaleFactory extends Factory
{
    protected $model = Sale::class;

    public function definition(): array
    {
        $currency = $this->faker->randomElement(['USD', 'LBP']);
        $profitCurrency = $this->faker->randomElement(['USD', 'LBP']);

        return [
            'total_amount' => 0, // placeholder, we update later
            'total_currency' => $currency,
            'profit_amount' => 0, // placeholder, we update later
            'profit_currency' => $profitCurrency,
            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Sale $sale) {
            $items = Item::inRandomOrder()->take(rand(1, 5))->get();

            $total = 0;
            $profit = 0;

            foreach ($items as $item) {
                $quantity = rand(1, 3);
                $sell = $item->sell_price_amount ?? rand(10, 200);
                $buy = $item->buy_price_amount ?? rand(5, $sell - 1);

                $sale->items()->attach($item->id, [
                    'sell_price_amount' => $sell,
                    'sell_price_currency' => $sale->total_currency,
                    'buy_price_amount' => $buy,
                    'buy_price_currency' => $sale->profit_currency,
                    'quantity' => $quantity,
                ]);

                $total += $sell * $quantity;
                $profit += ($sell - $buy) * $quantity;
            }

            $sale->update([
                'total_amount' => $total,
                'profit_amount' => $profit,
            ]);
        });
    }
}

