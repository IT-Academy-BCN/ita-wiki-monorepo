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
            $table->unsignedInteger('points_weekly')->default(0)->after('points');
        $table->enum('status', ['Junior Coder', 'Senior Coder', 'Skilled Developer','Expert Hacker'])->default('Junior Coder')->after('points_weekly');            $table->string('language')->nullable()->after('status');
            $table->unsignedBigInteger('league_id')->nullable()->after('language');
        });
    }

    public function down(): void
    {
        Schema::table('ligas', function (Blueprint $table): void {
            $table->dropColumn(['points_weekly', 'status', 'language', 'league_id']);
        });
    }
};