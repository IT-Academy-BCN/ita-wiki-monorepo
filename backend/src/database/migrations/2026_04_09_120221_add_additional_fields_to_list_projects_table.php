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
        Schema::table('list_projects', function (Blueprint $table) {
            $table->text('description')->nullable()->after('title');
            $table->date('limit_date_inscription')->nullable()->after('description');
            $table->integer('dev_front_number')->nullable()->after('limite_date_inscription');
            $table->integer('dev_back_number')->nullable()->after('dev_front_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('list_projects', function (Blueprint $table) {
            $table->dropColumn([
                'description',
                'limit_date_inscription',
                'dev_front_number',
                'dev_back_number'
            ]);
        });
    }
};
