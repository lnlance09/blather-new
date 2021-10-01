<?php

namespace App\Listeners;

use App\Events\ApplicationSent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendApplicationNotification
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
     * @param  ApplicationSent  $event
     * @return void
     */
    public function handle(ApplicationSent $event)
    {
        //
    }
}
