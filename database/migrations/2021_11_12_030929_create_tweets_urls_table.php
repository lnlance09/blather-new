<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTweetsUrlsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tweets_urls', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tweet_id');
            $table->text('url');
            $table->text('image')->nullable()->default(null);
            $table->string('title')->nullable()->default(null);
            $table->text('description')->nullable()->default(null);
            $table->timestamps();

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
        Schema::dropIfExists('tweets_urls');
    }
}
