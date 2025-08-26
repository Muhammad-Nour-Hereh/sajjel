<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create('sale_item', function (Blueprint $table) {
            $table->primary(['sale_id', 'item_id']);
            $table->foreignId('sale_id')->constrained('sales');
            $table->foreignId('item_id')->constrained('items');
            $table->decimal('cost_amount', 15, 2);
            $table->enum('cost_currency', ['USD', 'LBP']);
            $table->decimal('price_amount', 15, 2);
            $table->enum('price_currency', ['USD', 'LBP']);
            $table->unsignedInteger('quantity')->default(1);
            $table->softDeletes();
            $table->index(['sale_id', 'item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_item');
    }
};
