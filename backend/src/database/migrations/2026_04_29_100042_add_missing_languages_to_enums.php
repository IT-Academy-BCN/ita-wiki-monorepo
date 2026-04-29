<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
            DB::statement("ALTER TABLE list_projects MODIFY COLUMN language_backend ENUM('PHP','JavaScript','Java','React','TypeScript','Python','SQL','Other','Angular','Svelte','Vue','Node') NULL");
            DB::statement("ALTER TABLE list_projects MODIFY COLUMN language_frontend ENUM('PHP','JavaScript','Java','React','TypeScript','Python','SQL','Other','Angular','Svelte','Vue','Node') NULL");
            DB::statement("ALTER TABLE technical_tests MODIFY COLUMN language ENUM('PHP','JavaScript','Java','React','TypeScript','Python','SQL','Other','Angular','Svelte','Vue','Node')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
            DB::statement("ALTER TABLE list_projects MODIFY COLUMN language_backend ENUM('PHP','JavaScript','Java','React','TypeScript','Python','SQL') NULL");
            DB::statement("ALTER TABLE list_projects MODIFY COLUMN language_frontend ENUM('PHP','JavaScript','Java','React','TypeScript','Python','SQL') NULL");
            DB::statement("ALTER TABLE technical_tests MODIFY COLUMN language ENUM('PHP','JavaScript','Java','React','TypeScript','Python','SQL')");
    }
};
