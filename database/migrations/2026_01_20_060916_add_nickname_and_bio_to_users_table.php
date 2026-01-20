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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'nickname')) {
                $table->string('nickname')->nullable()->unique()->after('name');
            }
            if (!Schema::hasColumn('users', 'bio')) {
                $table->text('bio')->nullable()->after('nickname');
            }
            if (!Schema::hasColumn('users', 'daily_streak')) {
                $table->integer('daily_streak')->default(0)->after('bio');
            }
            if (!Schema::hasColumn('users', 'last_message_date')) {
                $table->timestamp('last_message_date')->nullable()->after('daily_streak');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = ['daily_streak', 'last_message_date'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
