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
        Schema::create('user_staminas', function (Blueprint $table) {
            $table->id('user_stamina_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedInteger('stamina_id')->nullable();
            $table->unsignedInteger('point')->nullable();
            $table->timestamp('last_updated_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'stamina_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_staminas');
    }
};
