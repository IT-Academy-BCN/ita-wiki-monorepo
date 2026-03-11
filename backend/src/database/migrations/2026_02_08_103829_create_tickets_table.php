<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\TicketTypeEnum;
use App\Enums\TicketStatusEnum;
use App\Enums\TicketPriorityEnum;
use App\Enums\AffectedAppEnum;
use App\Enums\AffectedFunctionEnum;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('code_connect_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('assignee_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('name');
            $table->date('incident_date');
            $table->enum('affected_app', AffectedAppEnum::values());
            $table->enum('type', TicketTypeEnum::values());
            $table->enum('affected_function', AffectedFunctionEnum::values());
            $table->text('description');
            $table->enum('status', TicketStatusEnum::values())->default('pending');
            $table->enum('priority', TicketPriorityEnum::values())->nullable();
            $table->foreignID('closed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
