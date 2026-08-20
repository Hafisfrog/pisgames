<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->string('medal');
            $table->text('note')->nullable();
            $table->timestamps();

            $table->unique(['event_id', 'team_id']);
            $table->index(['event_id', 'medal']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('results');
    }
};
