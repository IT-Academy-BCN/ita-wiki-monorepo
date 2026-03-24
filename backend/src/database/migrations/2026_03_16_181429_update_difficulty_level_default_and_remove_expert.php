<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("UPDATE technical_tests SET difficulty_level = 'easy' WHERE difficulty_level = 'expert'");

        DB::statement("ALTER TABLE technical_tests MODIFY COLUMN difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'easy' NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE technical_tests MODIFY COLUMN difficulty_level ENUM('easy', 'medium', 'hard', 'expert') DEFAULT NULL NULL");
    }
};
