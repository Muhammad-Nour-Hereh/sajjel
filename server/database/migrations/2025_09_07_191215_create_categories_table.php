<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        // category pivot table for subcategories
        Schema::create('category_category', function (Blueprint $table) {
            $table->foreignId('parent_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('child_id')->constrained('categories')->cascadeOnDelete();
            $table->primary(['parent_id', 'child_id']);
            $table->index('child_id');
        });

        // item pivot table
        Schema::create('category_item', function (Blueprint $table) {
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('item_id')->constrained('items')->cascadeOnDelete();
            $table->primary(['category_id', 'item_id']);
            $table->index('item_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_item');
        Schema::dropIfExists('category_category');
        Schema::dropIfExists('categories');
    }
};