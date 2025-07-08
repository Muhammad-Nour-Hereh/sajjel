<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory
{
    public function definition(): array
    {
        $placeholderUrl = config('app.url') . ':8000' . '/thumbnails/item_thumbnail_placeholder.png';

        return [
            'name' => $this->faker->word(),
            'model' => $this->faker->bothify('Model-###??'),
            'buy_price' => $this->faker->randomFloat(2, 10, 500),
            'buy_price_currency' => 'USD',  // or pick randomly if you want
            'sell_price' => $this->faker->randomFloat(2, 20, 1000),
            'sell_price_currency' => 'USD',
            'thumbnail' => $placeholderUrl,
            'note' => $this->faker->sentence(),
        ];
    }

}
