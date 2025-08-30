<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained('sales');
            $table->foreignId('item_id')->nullable()->constrained('items');
            $table->decimal('cost_amount', 15, 2);
            $table->enum('cost_currency', ['USD', 'LBP']);
            $table->decimal('price_amount', 15, 2);
            $table->enum('price_currency', ['USD', 'LBP']);
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedInteger('sort_order')->default(0)->after('quantity');
            $table->timestamps();
            $table->softDeletes();

            $table->index('sale_id');
            $table->index('item_id');
            $table->index(['sale_id', 'item_id']);
            $table->index(['sale_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};
