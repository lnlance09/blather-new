<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFallaciesTwitterTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fallacies_twitter', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fallacy_id');
            $table->string('highlighted_text')->nullable()->default(null);
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
        Schema::dropIfExists('fallacies_twitter');
    }
}
