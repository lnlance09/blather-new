<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (env('SEED_WITH_IMPORTS', 0) == 1) {
            DB::unprepared(file_get_contents(__DIR__ . '/imports/users.sql'));
            return;
        }

        User::factory()->count(25)->create();
    }
}
