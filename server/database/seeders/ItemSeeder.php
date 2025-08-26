<?php

namespace Database\Seeders;

use App\Models\Item;
use App\ValueObjects\Money;
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
                    'cost' => Money::usd(100),
                    'price' => Money::usd(150),
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
                'cost' => Money::usd(900),
                'price' => Money::usd(1299),
                'note' => 'Latest iPhone Pro model with titanium design',
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'model' => 'SM-S928B',
                'cost' => Money::lbp(80750000), // ~900 USD
                'price' => Money::lbp(116375000), // ~1300 USD
                'note' => 'Samsung flagship with S Pen',
            ],
            [
                'name' => 'MacBook Air M3',
                'model' => 'MRYR3',
                'cost' => Money::usd(950),
                'price' => Money::usd(1399),
                'note' => '13-inch MacBook Air with M3 chip',
            ],
            [
                'name' => 'AirPods Pro 2',
                'model' => 'MTJV3',
                'cost' => Money::lbp(13425000), // ~150 USD
                'price' => Money::lbp(22375000), // ~250 USD
                'note' => 'Active Noise Cancellation earbuds',
            ],
            [
                'name' => 'iPad Pro 12.9"',
                'model' => 'MHNK3',
                'cost' => Money::usd(800),
                'price' => Money::usd(1199),
                'note' => '12.9-inch iPad Pro with M2 chip',
            ],
            [
                'name' => 'Apple Watch Series 9',
                'model' => 'MR933',
                'cost' => Money::lbp(26850000), // ~300 USD
                'price' => Money::lbp(35800000), // ~400 USD
                'note' => 'GPS + Cellular 45mm smartwatch',
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'model' => 'WH1000XM5/B',
                'cost' => Money::usd(280),
                'price' => Money::usd(399),
                'note' => 'Industry-leading noise canceling headphones',
            ],
            [
                'name' => 'Nintendo Switch OLED',
                'model' => 'HEG-001',
                'cost' => Money::lbp(22375000), // ~250 USD
                'price' => Money::lbp(31325000), // ~350 USD
                'note' => 'Gaming console with OLED screen',
            ],
            [
                'name' => 'Dell XPS 13',
                'model' => 'XPS9315',
                'cost' => Money::usd(800),
                'price' => Money::usd(1199),
                'note' => '13-inch ultrabook with Intel Core i7',
            ],
            [
                'name' => 'Canon EOS R6 Mark II',
                'model' => 'EOS R6 II',
                'cost' => Money::lbp(179000000), // ~2000 USD
                'price' => Money::lbp(224250000), // ~2500 USD
                'note' => 'Full-frame mirrorless camera',
            ],
        ];

        foreach ($specificItems as $itemData) {
            Item::factory()->create($itemData);
        }
    }
}