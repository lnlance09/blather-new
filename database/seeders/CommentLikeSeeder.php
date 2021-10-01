<?php

namespace Database\Seeders;

use App\Models\CommentLike;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommentLikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        CommentLike::factory()->count(4000)->create();
    }
}
