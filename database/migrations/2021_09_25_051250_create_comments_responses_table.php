<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsResponsesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comments_responses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('response_to');
            $table->unsignedBigInteger('user_id');
            $table->text('msg');
            $table->timestamps();

            $table->foreign('response_to')->references('id')->on('comments');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('comments_responses');
    }
}
