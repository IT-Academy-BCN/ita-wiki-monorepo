<?php

declare (strict_types= 1);


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\ForumQuestion;

class ListProjects extends Model
{
    use HasFactory;
    protected $table = 'list_projects';
    protected $fillable = [
        'user_id',
        'title',
        'time_duration',
        'language_backend',
        'language_frontend',
    
    ];

    public function contributorListProject()
    {
        return $this->hasMany(ContributorListProject::class, 'list_project_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function forumQuestions()
    {
        return $this->hasMany(ForumQuestion::class, 'list_project_id');
    }

}
