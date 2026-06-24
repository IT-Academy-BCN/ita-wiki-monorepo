<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Enums\TicketCategoryEnum;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('tickets')
            ->whereNull('category')
            ->update(['category' => TicketCategoryEnum::Other->value]);

        Schema::table('tickets', function (Blueprint $table) {
            $table->enum('category', TicketCategoryEnum::values())->change();
        });
    }

    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->enum('category', TicketCategoryEnum::values())->nullable()->change();
        });
    }
};