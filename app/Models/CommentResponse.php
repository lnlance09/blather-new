<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;

class CommentResponse extends Model
{
    use HasFactory;

    protected $table = 'comments_responses';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'msg',
        'response_to',
        'user_id',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [];

    public function comment()
    {
        return $this->belongsTo(Comment::class, 'id', 'response_to');
    }

    public function likedByMe()
    {
        return $this->hasMany(CommentLike::class, 'response_id', 'id');
    }

    public function likes()
    {
        return $this->hasMany(CommentLike::class, 'response_id', 'id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
