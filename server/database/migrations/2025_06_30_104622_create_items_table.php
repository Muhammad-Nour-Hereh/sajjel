<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('model')->nullable();
            $table->decimal('buy_price_amount', 10, 2)->nullable();
            $table->enum('buy_price_currency', ['USD', 'LBP'])->default('USD');
            $table->decimal('sell_price_amount', 10, 2)->nullable();
            $table->enum('sell_price_currency', ['USD', 'LBP'])->default('USD');
            $table->string('thumbnail')->nullable();
            $table->string('note')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('items');
    }
};
