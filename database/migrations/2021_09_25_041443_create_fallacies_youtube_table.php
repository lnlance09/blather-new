<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFallaciesYoutubeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fallacies_youtube', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fallacy_id');
            $table->integer('start_time')->nullable();
            $table->integer('end_time')->nullable();
            $table->unsignedBigInteger('video_id');
            $table->timestamps();

            $table->foreign('fallacy_id')->references('id')->on('fallacies');
            $table->foreign('video_id')->references('id')->on('videos');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fallacies_youtube');
    }
}
