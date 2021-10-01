<?php

namespace App\Listeners;

use App\Events\PredictionCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendPredictionNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  PredictionCreated  $event
     * @return void
     */
    public function handle(PredictionCreated $event)
    {
        //
    }
}
