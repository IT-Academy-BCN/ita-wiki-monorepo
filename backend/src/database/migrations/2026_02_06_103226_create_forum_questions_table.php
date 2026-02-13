<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forum_questions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('list_project_id')
                ->constrained('list_projects')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('question', 500);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forum_questions');
    }
};
