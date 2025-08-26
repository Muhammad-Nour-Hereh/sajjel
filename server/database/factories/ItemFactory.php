<?php

namespace Database\Factories;

use App\Models\Item;
use App\ValueObjects\Money;
use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory
{
    protected $model = Item::class;

    public function definition(): array
    {
        // $placeholderUrl = '/thumbnails/item_thumbnail_placeholder.png';
        $placeholderUrl = null;

        $currencies = ['USD', 'LBP'];
        $currency = $this->faker->randomElement($currencies);
        
        if ($currency === 'USD') {
            $costAmount = $this->faker->randomFloat(2, 10, 500);
            $priceAmount = $costAmount * $this->faker->randomFloat(2, 1.2, 3.0);
        } else { // LBP
            $costAmount = $this->faker->randomFloat(2, 500000, 25000000);
            $priceAmount = $costAmount * $this->faker->randomFloat(2, 1.2, 3.0);
        }

        return [
            'name' => $this->faker->word(),
            'model' => $this->faker->bothify('Model-###??'),
            'cost' => new Money($costAmount, \App\ValueObjects\Currency::from($currency)),
            'price' => new Money($priceAmount, \App\ValueObjects\Currency::from($currency)),
            'thumbnail' => $placeholderUrl,
            'note' => $this->faker->sentence(),
        ];
    }

    /**
     * Create item with USD currency
     */
    public function usd(): static
    {
        return $this->state(function (array $attributes) {
            $costAmount = $this->faker->randomFloat(2, 10, 500);
            $priceAmount = $costAmount * $this->faker->randomFloat(2, 1.2, 3.0);
            
            return [
                'cost' => new Money($costAmount, \App\ValueObjects\Currency::USD),
                'price' => new Money($priceAmount, \App\ValueObjects\Currency::USD),
            ];
        });
    }

    /**
     * Create item with LBP currency
     */
    public function lbp(): static
    {
        return $this->state(function (array $attributes) {
            $costAmount = $this->faker->randomFloat(2, 500000, 25000000);
            $priceAmount = $costAmount * $this->faker->randomFloat(2, 1.2, 3.0);
            
            return [
                'cost' => new Money($costAmount, \App\ValueObjects\Currency::LBP),
                'price' => new Money($priceAmount, \App\ValueObjects\Currency::LBP),
            ];
        });
    }
}