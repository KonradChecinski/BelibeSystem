<?php

namespace App\Models;

use App\Models\Client\Client;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Lab404\Impersonate\Models\Impersonate;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, Impersonate, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'subiekt_id',
        'name',
        'firstname',
        'lastname',
        'email',
        'password',
        'active',
        'account_manager',
        'phone',
        'subiekt_category_name',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    public function canImpersonate(): bool
    {
        return $this->hasPermissionTo("canImpersonate", "user");
    }


    public function canBeImpersonated(): bool
    {
        return $this->hasPermissionTo("canBeImpersonate", "user");
    }


    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }

    public function clientsActivities(): HasMany
    {
        return $this->hasMany(ClientActivity::class);
    }

    public function clientsTasks(): HasMany
    {
        return $this->hasMany(ClientTask::class);
    }

    public function clientsNotes(): HasMany
    {
        return $this->hasMany(ClientNote::class);
    }
}
