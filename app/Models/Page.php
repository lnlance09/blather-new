<?php

namespace App\Models;

use App\Models\FallacyTwitter;
use App\Models\Tweet;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;

class Page extends Model
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'bio',
        'image',
        'name',
        'network',
        'social_media_id',
        'username'
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

    public function contradictions()
    {
        return $this->hasMany(Fallacy::class, 'page_id', 'id')->where('ref_id', 21);
    }

    public function fallacies()
    {
        return $this->hasMany(Fallacy::class, 'page_id', 'id')->where('ref_id', '!=', 21);
    }

    public function tweets()
    {
        return $this->hasMany(Tweet::class, 'page_id', 'id');
    }
}
