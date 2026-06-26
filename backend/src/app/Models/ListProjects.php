<?php

declare (strict_types= 1);


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\ForumQuestion;
use App\Enums\ProjectStatusEnum;

class ListProjects extends Model
{
    use HasFactory;
    protected $table = 'list_projects';
    protected $casts = [
        'roadmap' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'status' => ProjectStatusEnum::class,
    ];
    protected $fillable = [
        'user_id',
        'title',
        'limit_date_inscription',
        'start_date',
        'end_date',
        'dev_front_number',
        'dev_back_number',
        'time_duration',
        'language_backend',
        'language_frontend',
        'description',
        'roadmap',
        'status',
        'github_url',
        'youtube_url',
    ];

    public function contributorListProject()
    {
        return $this->hasMany(ContributorListProject::class, 'list_project_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function forumQuestions()
    {
        return $this->hasMany(ForumQuestion::class, 'list_project_id');
    }

}
