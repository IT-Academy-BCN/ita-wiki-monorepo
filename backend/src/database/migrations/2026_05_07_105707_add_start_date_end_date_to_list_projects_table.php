<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('list_projects', function (Blueprint $table) {
            $table->date('start_date')->nullable()->after('limit_date_inscription');
            $table->date('end_date')->nullable()->after('start_date');
        });
    }

    public function down(): void
    {
        Schema::table('list_projects', function (Blueprint $table) {
            $table->dropColumn(['start_date', 'end_date']);
        });
    }
};
