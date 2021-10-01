<?php

namespace App\Console\Commands;

use App\Models\Coin;
use App\Models\Prediction;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CorrectPredictions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'predictions:correct';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update all predictions that are set to expire on a given day';

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
        $now = Carbon::now();
        $nowFormat = $now->format('Y-m-d h:i:s');
        $thenFormat = $now->addHours(6)->format('Y-m-d h:i:s');
        $predictions = Prediction::with(['coin'])
            ->where('status', 'Pending')
            ->whereBetween('target_date', [$nowFormat, $thenFormat])
            ->get();

        foreach ($predictions as $p) {
            $coinId = $p->coin->cmc_id;
            $predictionPrice = $p->prediction_price;
            $currentPrice = (float) Coin::getPriceAtTimeCMC($coinId, $now->timestamp);
            $margin = 100 - ($predictionPrice / $currentPrice) * 100;
            $status = abs($margin) > 5 ? 'Incorrect' : 'Correct';

            $p->actual_price = $currentPrice;
            $p->margin = $margin;
            $p->status = $status;
            $p->save();
        }
    }
}
