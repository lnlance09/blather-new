<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;

class Fallacy extends Model
{
    use HasFactory, Notifiable;

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
        'group_id',
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
    protected $casts = [];

    public function page()
    {

        return $this->hasOne(Page::class, 'id', 'page_id');
    }

    public function group()
    {

        return $this->hasOne(Group::class, 'id', 'group_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function reference()
    {
        return $this->hasOne(Reference::class, 'id', 'ref_id');
    }

    public function twitter()
    {
        return $this->hasOne(FallacyTwitter::class, 'fallacy_id', 'id');
    }

    public function youtube()
    {
        return $this->hasOne(FallacyYouTube::class, 'fallacy_id', 'id');
    }

    public function contradictionTwitter()
    {
        return $this->hasOne(ContradictionTwitter::class, 'fallacy_id', 'id');
    }

    public function contradictionYouTube()
    {
        return $this->hasOne(ContradictionYouTube::class, 'fallacy_id', 'id');
    }
}
