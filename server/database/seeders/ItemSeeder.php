<?php

namespace Database\Seeders;

use App\Models\Item;
use App\ValueObjects\Money;
use App\ValueObjects\Currency;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    public function run(): void
    {
        // Create a mix of USD and LBP items
        Item::factory()->usd()->count(60)->create();
        Item::factory()->lbp()->count(30)->create();

        // Create some specific test items with known data
        $this->createSpecificItems();

        // Verify all items have cost and price
        $this->verifyItemsHaveMoneyValues();
    }

    private function verifyItemsHaveMoneyValues(): void
    {
        $itemsWithoutCost = Item::whereNull('cost_amount')->count();
        $itemsWithoutPrice = Item::whereNull('price_amount')->count();

        if ($itemsWithoutCost > 0 || $itemsWithoutPrice > 0) {
            $this->command->warn("Found {$itemsWithoutCost} items without cost and {$itemsWithoutPrice} items without price");

            // Fix items without cost or price
            Item::whereNull('cost_amount')->orWhereNull('price_amount')->each(function ($item) {
                $item->update([
                    'cost' => new Money(100, \App\ValueObjects\Currency::USD),
                    'price' => new Money(150, \App\ValueObjects\Currency::USD),
                ]);
            });
        }
    }

    private function createSpecificItems(): void
    {
        $specificItems = [
            [
                'name' => 'iPhone 15 Pro',
                'model' => 'A3101',
                'cost' => new Money(900, Currency::USD),
                'price' => new Money(1299, Currency::USD),
                'note' => 'Latest iPhone Pro model with titanium design',
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'model' => 'SM-S928B',
                'cost' => new Money(80750000, Currency::LBP), // ~900 USD
                'price' => new Money(116375000, Currency::LBP), // ~1300 USD
                'note' => 'Samsung flagship with S Pen',
            ],
            [
                'name' => 'MacBook Air M3',
                'model' => 'MRYR3',
                'cost' => new Money(950, Currency::USD),
                'price' => new Money(1399, Currency::USD),
                'note' => '13-inch MacBook Air with M3 chip',
            ],
            [
                'name' => 'AirPods Pro 2',
                'model' => 'MTJV3',
                'cost' => new Money(13425000, Currency::LBP), // ~150 USD
                'price' => new Money(22375000, Currency::LBP), // ~250 USD
                'note' => 'Active Noise Cancellation earbuds',
            ],
            [
                'name' => 'iPad Pro 12.9"',
                'model' => 'MHNK3',
                'cost' => new Money(800, Currency::USD),
                'price' => new Money(1199, Currency::USD),
                'note' => '12.9-inch iPad Pro with M2 chip',
            ],
            [
                'name' => 'Apple Watch Series 9',
                'model' => 'MR933',
                'cost' => new Money(26850000, Currency::LBP), // ~300 USD
                'price' => new Money(35800000, Currency::LBP), // ~400 USD
                'note' => 'GPS + Cellular 45mm smartwatch',
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'model' => 'WH1000XM5/B',
                'cost' => new Money(280, Currency::USD),
                'price' => new Money(399, Currency::USD),
                'note' => 'Industry-leading noise canceling headphones',
            ],
            [
                'name' => 'Nintendo Switch OLED',
                'model' => 'HEG-001',
                'cost' => new Money(22375000, Currency::LBP), // ~250 USD
                'price' => new Money(31325000, Currency::LBP), // ~350 USD
                'note' => 'Gaming console with OLED screen',
            ],
            [
                'name' => 'Dell XPS 13',
                'model' => 'XPS9315',
                'cost' => new Money(800, Currency::USD),
                'price' => new Money(1199, Currency::USD),
                'note' => '13-inch ultrabook with Intel Core i7',
            ],
            [
                'name' => 'Canon EOS R6 Mark II',
                'model' => 'EOS R6 II',
                'cost' => new Money(179000000, Currency::LBP), // ~2000 USD
                'price' => new Money(224250000, Currency::LBP), // ~2500 USD
                'note' => 'Full-frame mirrorless camera',
            ],
        ];

        foreach ($specificItems as $itemData) {
            Item::factory()->create($itemData);
        }
    }
}