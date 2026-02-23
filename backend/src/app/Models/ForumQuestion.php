<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ForumQuestion extends Model
{
    use HasFactory;

    protected $table = 'forum_questions';

    protected $fillable = [
        'list_project_id',
        'user_id',
        'question'
    ];

    public function project()
    {
        return $this->belongsTo(ListProjects::class, 'list_project_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function answers()
    {
        return $this->hasMany(ForumAnswer::class, 'forum_question_id', 'id');
    }
}
