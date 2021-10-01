<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;

class FallacyYouTube extends Model
{
    use HasFactory;

    protected $table = 'fallacies_youtube';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'end_time',
        'fallacy_id',
        'start_time',
        'video_id'
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

    public function video()
    {
        return $this->hasOne(Video::class, 'id', 'video_id');
    }
}
