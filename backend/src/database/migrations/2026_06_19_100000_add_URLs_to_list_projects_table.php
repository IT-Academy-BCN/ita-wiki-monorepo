<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('list_projects', function (Blueprint $table) {
            
            $table->string('github_url')->nullable()->after('roadmap');
            $table->string('youtube_url')->nullable()->after('github_url');
        });
    }

    public function down(): void
    {
        Schema::table('list_projects', function (Blueprint $table) {

            $table->dropColumn(['github_url', 'youtube_url']);
        });
    }
};
