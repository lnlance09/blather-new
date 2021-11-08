<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactMessage extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The order instance.
     *
     * @var String
     */
    public $msg;

    /**
     * Create a new message instance.
     *
     * @param  String  $msg
     * @return void
     */
    public function __construct(String $msg)
    {
        $this->msg = $msg;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('noreply@blather.io')
            ->view('mail/contactMessage');
    }
}
