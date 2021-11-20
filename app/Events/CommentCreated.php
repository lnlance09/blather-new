<?php

namespace App\Events;

use App\Http\Resources\Comment as CommentResource;
use App\Models\Comment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CommentCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The application that was submitted.
     *
     * @var Comment
     */
    public $comment;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Comment $comment
     * @return void
     */
    public function __construct(Comment $comment)
    {
        $this->comment = new CommentResource($comment);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('.');
    }
}
