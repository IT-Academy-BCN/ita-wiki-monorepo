<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ForumAnswer extends Model
{
    use HasFactory;

    protected $table = 'forum_answers';

    protected $fillable = [
        'forum_question_id',
        'user_id',
        'answer'
    ];

    public function question()
    {
        return $this->belongsTo(ForumQuestion::class, 'forum_question_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
