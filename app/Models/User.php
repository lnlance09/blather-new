<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    const PROTECTED_USERNAMES = [
        'about',
        'activity',
        'all',
        'assign',
        'changePassword',
        'checkUsername',
        'contact',
        'create',
        'fallacies',
        'fallacy',
        'follow',
        'forgot',
        'home',
        'login',
        'options',
        'pages',
        'privacy',
        'profilePic',
        'reference',
        'rules',
        'settings',
        'sitemap',
        'terms',
        'unfollow',
        'update',
        'verify',
        'verifyForgotCode'
    ];

    protected $accuracy = 0;

    protected $appends = [
        // 'accuracy',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'api_token',
        'bio',
        'code',
        'email',
        'email_verified_at',
        'forgot_code',
        'image',
        'name',
        'password',
        'username'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'code',
        'email_verified_at',
        'password',
        'remember_token'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime'
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function likes()
    {
        return $this->hasMany(CommentLike::class);
    }

    public function responses()
    {
        return $this->hasMany(CommentResponse::class);
    }

    public function fallacies()
    {
        return $this->hasMany(Fallacy::class);
    }

    public function retractedFallacies()
    {
        return $this->hasMany(Fallacy::class)->where('retracted', '=', '1');
    }

    public function twitter()
    {
        return $this->hasOne(UserTwitter::class, 'user_id', 'id');
    }
}
