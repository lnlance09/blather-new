<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArgumentExampleTweetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('argument_example_tweets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('argument_id');
            $table->unsignedBigInteger('tweet_id');
            $table->timestamps();

            $table->foreign('argument_id')->references('id')->on('arguments');
            $table->foreign('tweet_id')->references('id')->on('tweets');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('argument_example_tweets');
    }
}
