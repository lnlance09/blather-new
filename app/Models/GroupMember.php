<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;

class GroupMember extends Model
{
    use HasFactory;

    protected $table = 'groups_members';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'group_id',
        'page_id'
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

    public function group()
    {
        return $this->hasOne(Group::class, 'id', 'group_id');
    }

    public function page()
    {
        return $this->hasOne(Page::class, 'id', 'page_id');
    }
}
