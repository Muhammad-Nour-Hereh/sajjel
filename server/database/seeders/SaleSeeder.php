<?php

namespace Database\Seeders;

use App\Models\Sale;
use Illuminate\Database\Seeder;

class SaleSeeder extends Seeder
{
    public function run(): void
    {
        // Create sales with random items (most sales)
        Sale::factory()->count(80)->create();

        // Create sales with mixed currencies
        Sale::factory()->mixedCurrencies()->count(15)->create();

    }
}