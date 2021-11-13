<?php

namespace App\Events;

use App\Http\Resources\Fallacy as FallacyResource;
use App\Models\Fallacy;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FallacyCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The application that was submitted.
     *
     * @var Fallacy
     */
    public $fallacy;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Fallacy $Fallacy
     * @return void
     */
    public function __construct(Fallacy $fallacy)
    {
        $this->fallacy = new FallacyResource($fallacy);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('fallacies');
    }
}
