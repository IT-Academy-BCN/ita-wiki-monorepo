<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forum_answers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('forum_question_id')
                ->constrained('forum_questions')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('answer', 1000);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forum_answers');
    }
};
