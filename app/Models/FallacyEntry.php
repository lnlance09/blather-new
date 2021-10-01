<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;

class FallacyEntry extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'fallacy_entries';

    /**
     * The event map for the model.
     *
     * @var array
     */
    protected $dispatchesEvents = [
        // 'created' => FallacyCreated::class
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        // 'id',
        'explanation',
        'page_id',
        'ref_id',
        'retracted',
        's3_link',
        'slug',
        'status',
        'title',
        'user_id',
        'views'
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

    public function page()
    {
        return $this->hasOne(Page::class, 'id', 'page_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function reference()
    {
        return $this->hasOne(Reference::class, 'id', 'ref_id');
    }

    public function tweet()
    {
        return $this->hasOne(FallacyTwitter::class, 'fallacy_id', 'id');
    }

    public function video()
    {
        return $this->hasOne(FallacyYouTube::class, 'fallacy_id', 'id');
    }
}
