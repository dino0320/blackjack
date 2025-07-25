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
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('user_name')->nullable();
            $table->string('device_name')->nullable();
            $table->boolean('is_game')->nullable()->default(false);
            $table->unsignedInteger('high_score')->nullable()->default(0);
            $table->timestamps();
            $table->index('high_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
