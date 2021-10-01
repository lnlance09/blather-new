<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;

class Video extends Model
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'date_created',
        'description',
        'dislike_count',
        'like_count',
        'page_id',
        's3_link',
        'thumbmnail',
        'title',
        'video_id',
        'view_count'
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
        // 'date_created' => 'datetime'
    ];

    public function fallacies()
    {
        return $this->hasMany(FallacyYouTube::class, 'video_id', 'id');
    }
}
