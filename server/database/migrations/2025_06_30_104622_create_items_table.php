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
            $table->decimal('buy_price')->nullable();
            $table->decimal('sell_price')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('note')->nullable();
        });
    }

    public function down(): void {
        Schema::dropIfExists('items');
    }
};
