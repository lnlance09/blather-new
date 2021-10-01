<?php

namespace Database\Seeders;

use App\Models\Tweet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TweetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (env('SEED_WITH_IMPORTS', 0) == 1) {
            DB::unprepared(file_get_contents(__DIR__ . '/imports/tweets.sql'));
            return;
        }

        Tweet::factory()->count(200)->create();
    }
}
