<?php

namespace Database\Seeders;

use App\Models\Sale;
use App\Models\Item;
use App\ValueObjects\Money;
use App\ValueObjects\Currency;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

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