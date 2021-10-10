<?php

namespace App\Models;

use App\Models\ArgumentContradiction;
use App\Models\ArgumentExampleTweet;
use App\Models\ArgumentImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Argument extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'description',
        'explanation',
        'slug',
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

    public function contradictions()
    {
        return $this->hasMany(ArgumentContradiction::class, 'argument_id', 'id');
    }

    public function images()
    {
        return $this->hasMany(ArgumentImage::class, 'argument_id', 'id');
    }

    public function tweets()
    {
        return $this->hasMany(ArgumentExampleTweet::class, 'argument_id', 'id');
    }
}
