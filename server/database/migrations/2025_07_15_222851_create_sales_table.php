<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->decimal('total_cost_amount', 15, 2)->default(0);
            $table->enum('total_cost_currency', ['USD', 'LBP'])->default('USD');
            $table->decimal('total_revenue_amount', 15, 2)->default(0);
            $table->enum('total_revenue_currency', ['USD', 'LBP'])->default('USD');
            $table->timestamp('sold_at');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
