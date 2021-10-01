<?php

namespace Database\Seeders;

use App\Models\Fallacy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FallacySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (env('SEED_WITH_IMPORTS', 0) == 1) {
            DB::unprepared(file_get_contents(__DIR__ . '/imports/fallacies.sql'));
            DB::unprepared(file_get_contents(__DIR__ . '/imports/fallaciesTwitter.sql'));
            DB::unprepared(file_get_contents(__DIR__ . '/imports/fallaciesYouTube.sql'));
            return;
        }

        Fallacy::factory()->count(200)->create();
    }
}
