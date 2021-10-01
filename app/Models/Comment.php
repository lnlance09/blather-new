<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;

class Comment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'fallacy_id',
        'msg',
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
    protected $casts = [
        
    ];

    public function fallacy()
    {
        return $this->belongsTo(Fallacy::class, 'id', 'fallacy_id');
    }

    public function likes()
    {
        return $this->hasMany(CommentLike::class, 'comment_id', 'id')->where('response_id', null);
    }

    public function responses()
    {
        return $this->hasMany(CommentResponse::class, 'response_to', 'id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
