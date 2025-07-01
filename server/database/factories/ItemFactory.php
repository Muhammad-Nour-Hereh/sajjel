<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory {
    public function definition(): array {
        return [
            'name'        => $this->faker->word(),
            'model'       => $this->faker->bothify('Model-###??'),
            'buy_price'   => $this->faker->randomFloat(2, 10, 500),
            'sell_price'  => $this->faker->randomFloat(2, 20, 1000),
            'thumbnail'   => $this->faker->imageUrl(640, 480, 'technics', true),
            'note'        => $this->faker->sentence(),
        ];
    }
}
