<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContradictionsTwitterTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contradictions_twitter', function (Blueprint $table) {
            $table->id();
            $table->string('highlighted_text')->nullable();
            $table->unsignedBigInteger('fallacy_id');
            $table->unsignedBigInteger('tweet_id');
            $table->timestamps();

            $table->foreign('fallacy_id')->references('id')->on('fallacies');
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
        Schema::dropIfExists('contradictions_twitter');
    }
}
