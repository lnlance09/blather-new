<?php

namespace App\Events;

use App\Http\Resources\Prediction as PredictionResource;
use App\Models\Prediction;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PredictionCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The application that was submitted.
     *
     * @var ApplicationResource
     */
    public $prediction;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Prediction $prediction
     * @return void
     */
    public function __construct(Prediction $prediction)
    {
        $this->prediction = new PredictionResource($prediction);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('publicPredictions');
    }
}
