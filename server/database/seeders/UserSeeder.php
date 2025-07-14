<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder {
    public function run(): void {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'admin@admin.com',
            'password'=> bcrypt('121212'),
        ]);
    }
}
