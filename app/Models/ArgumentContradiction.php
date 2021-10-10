<?php

namespace App\Models;

use App\Models\Argument;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArgumentContradiction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'argument_id',
        'contradicting_argument_id',
        'explanation'
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

    public function argument()
    {
        return $this->hasOne(Argument::class, 'id', 'argument_id');
    }

    public function contradiction()
    {
        return $this->hasOne(Argument::class, 'id', 'contradicting_argument_id');
    }
}
