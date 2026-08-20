<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sport_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('category')->nullable();
            $table->string('gender')->nullable();
            $table->date('event_date')->nullable();
            $table->string('status')->default('scheduled');
            $table->timestamps();

            $table->unique(['sport_id', 'name', 'category', 'gender']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
