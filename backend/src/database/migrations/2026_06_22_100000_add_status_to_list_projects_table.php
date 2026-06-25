<?php

declare(strict_types=1);

use App\Enums\ProjectStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('list_projects', function (Blueprint $table): void {
            $table->enum('status', ProjectStatusEnum::values())
                  ->default(ProjectStatusEnum::IN_PROGRESS->value)
                  ->after('language_frontend');
        });
    }
    public function down(): void
    {
        Schema::table('list_projects', function (Blueprint $table): void {
            $table->dropColumn('status');
        });
    }
};
