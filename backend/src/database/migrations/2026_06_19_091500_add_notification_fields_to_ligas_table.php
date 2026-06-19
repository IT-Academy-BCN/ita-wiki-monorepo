<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ligas', function (Blueprint $table): void {
            $table->unsignedBigInteger('previous_league_id')->nullable()->after('league_id');
            $table->boolean('notification_dismissed')->default(false)->after('previous_league_id');
        });
    }

    public function down(): void
    {
        Schema::table('ligas', function (Blueprint $table): void {
            $table->dropColumn(['previous_league_id', 'notification_dismissed']);
        });
    }
};
