<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UserSeeder::class,
            PageSeeder::class,
            ReferenceSeeder::class,
            TweetSeeder::class,
            VideoSeeder::class,
            FallacySeeder::class,
            ContradictionTwitterSeeder::class,
            ContradictionYouTubeSeeder::class,
            CommentSeeder::class,
            CommentResponseSeeder::class,
            CommentLikeSeeder::class,
            ArgumentSeeder::class,
            ArgumentContradictionSeeder::class,
            ArgumentExampleTweetSeeder::class,
            ArgumentImageSeeder::class,
            GroupSeeder::class,
            GroupMemberSeeder::class
        ]);
    }
}
