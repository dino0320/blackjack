<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('staminas', function (Blueprint $table) {
            $table->id('stamina_id');
            $table->integer('min_point');
            $table->integer('max_point');
            $table->integer('initial_point');
            $table->integer('consumed_point');
            $table->integer('recovery_point');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staminas');
    }
};
