    <?php

    declare(strict_types=1);

    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;
    use Illuminate\Database\Eloquent\Relations\BelongsTo;
    use Illuminate\Database\Eloquent\Relations\HasMany;
    use App\Enums\TicketStatusEnum;
    use App\Enums\TicketTypeEnum;
    use App\Enums\TicketPriorityEnum;
    use App\Enums\AffectedAppEnum;
    use App\Enums\AffectedFunctionEnum;
    use App\Models\ForumAnswer;
    class Ticket extends Model
    {
        /** @use HasFactory<\Database\Factories\TicketFactory> */
        use HasFactory;

        protected $fillable = [
            'code_connect_id',
            'forum_answer_id',
            'name',
            'incident_date',
            'affected_app',
            'type',
            'affected_function',
            'description',
            'status',
            'priority',
            'assignee_id',
            'closed_by',
            'closed_at'
        ];

        protected $casts = [
            'incident_date' => 'date',
            'status' => TicketStatusEnum::class,
            'type' => TicketTypeEnum::class,
            'priority' => TicketPriorityEnum::class,
            'affected_app' => AffectedAppEnum::class,
            'affected_function' => AffectedFunctionEnum::class,
            'closed_at' => 'datetime'
        ];

        public function codeConnect(): BelongsTo
        {
            return $this->belongsTo(User::class, 'code_connect_id');
        }

        public function closedBy(): BelongsTo
        {
            return $this->belongsTo(User::class, 'closed_by');
        }

        public function assignee(): BelongsTo
        {
            return $this->belongsTo(User::class, 'assignee_id');
        }

        public function comments(): HasMany
        {
            return $this->hasMany(TicketComment::class);
        }
        public function forumAnswer(): BelongsTo
        {
            return $this->belongsTo(ForumAnswer::class, 'forum_answer_id');
        }
        
    }
