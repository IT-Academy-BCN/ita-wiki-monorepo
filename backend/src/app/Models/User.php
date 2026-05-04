<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;



class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasApiTokens, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected string $guard_name = 'api';

    protected $fillable = [
        'github_id',
        'github_user_name',
        'name',
        'avatar',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
        ];
    }

    /**
     * Find user by GitHub ID
     */
    public static function findByGithubId(int $githubId): ?self
    {
        return static::where('github_id', $githubId)->first();
    }

    public function getAvatarUrlAttribute(): ?string{
        if(! $this->avatar){
            return null;
        }

        if(str_starts_with($this->avatar, 'http')){
            return $this->avatar;
        }

        return asset('storage/avatars/' . $this->avatar);
    }

    /**
     * Get user's role name for API responses
     */
    public function getRoleName(): string
    {
        return $this->getRoleNames()->first() ?? 'sin rol';
    }

    /**
     * Get the guard name for the user
     */
    public function getGuardName(): string 
    { 
        return (string) $this->guard_name; 
    }

    /**
     * Relationships with Tickets System
     */

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'code_connect_id');
    }

    public function closedTickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'closed_by');
    }

    public function ticketComments(): HasMany
    {
        return $this->hasMany(TicketComment::class);
    }

    public function ligaEntry(): HasOne
    {
      return $this->hasOne(Liga::class);
    }


}
