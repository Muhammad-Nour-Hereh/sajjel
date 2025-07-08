<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory {
    public function definition(): array {
        $placeholderUrl = config('app.url'). ':8000' . '/thumbnails/item_thumbnail_placeholder.png';

        return [
            'name'       => $this->faker->word(),
            'model'      => $this->faker->bothify('Model-###??'),
            'buy_price'  => $this->faker->randomFloat(2, 10, 500),
            'sell_price' => $this->faker->randomFloat(2, 20, 1000),
            'thumbnail'  => $placeholderUrl,
            'note'       => $this->faker->sentence(),
        ];
    }
}
