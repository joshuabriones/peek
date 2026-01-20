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
        // Check if message_reads table exists
        if (!Schema::hasTable('message_reads')) {
            Schema::create('message_reads', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('message_id')->constrained()->onDelete('cascade');
                $table->timestamps();

                $table->unique(['user_id', 'message_id']);
                $table->index(['message_id', 'created_at']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message_reads');
    }
};
