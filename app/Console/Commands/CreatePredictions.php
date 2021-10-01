<?php

namespace App\Console\Commands;

use App\Models\Prediction;
use App\Models\User;
use Illuminate\Console\Command;

class CreatePredictions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'predictions:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create predictions that will be pending';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $allCount = User::all()->count();
        $percent = mt_rand(2, 5);
        $count = ceil($allCount * ($percent / 100));
        $users = User::where('has_api_access', 1)
            ->with(['predictionsLastTwoDays'])
            ->has('predictionsLastTwoDays', '=', 0)
            ->limit($count)
            ->get();

        foreach ($users as $user) {
            $count = mt_rand(1, 3);
            Prediction::factory()->count($count)->create([
                'user_id' => $user->id
            ]);
        }
    }
}
