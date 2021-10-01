<?php

namespace App\Events;

use App\Http\Resources\Application as ApplicationResource;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ApplicationSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The application that was submitted.
     *
     * @var ApplicationResource
     */
    public $application;

    /**
     * Create a new event instance.
     *
     * @param  ApplicationResource  $application
     * @return void
     */
    public function __construct(ApplicationResource $application)
    {
        $this->application = $application;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('users.' . $this->application->user->id);
    }
}
