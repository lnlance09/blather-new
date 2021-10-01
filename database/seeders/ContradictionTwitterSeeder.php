<?php

namespace Database\Seeders;

use App\Models\ContradictionTwitter;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContradictionTwitterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (env('SEED_WITH_IMPORTS', 0) == 1) {
            DB::unprepared(file_get_contents(__DIR__ . '/imports/contradictionsTwitter.sql'));
            return;
        }

        ContradictionTwitter::factory()->count(200)->create();
    }
}
