<?php

namespace App\Models;

use App\Events\CommentCreated;
use Illuminate\Database\Eloquent\BroadcastsEvents;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;

class Comment extends Model
{
    use BroadcastsEvents, HasFactory;

    /**
     * The event map for the model.
     *
     * @var array
     */
    protected $dispatchesEvents = [
        'created' => CommentCreated::class
    ];

    /**
     * Get the channels that model events should broadcast on.
     *
     * @param  string  $event
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn($event)
    {
        return [$this, $this->fallacy];
    }

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
    protected $casts = [];

    public function fallacy()
    {
        return $this->belongsTo(Fallacy::class, 'id', 'fallacy_id');
    }

    public function likedByMe()
    {
        return $this->hasMany(CommentLike::class, 'comment_id', 'id')->where('response_id', null);
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
