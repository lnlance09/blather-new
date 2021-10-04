<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTweetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tweets', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('tweet_id');
            $table->unsignedBigInteger('page_id');
            $table->string('full_text');
            $table->bigInteger('favorite_count')->nullable();
            $table->bigInteger('retweet_count')->nullable();
            $table->text('entities')->nullable();
            $table->text('extended_entities')->nullable();
            $table->integer('quoted_status')->nullable();
            $table->integer('retweeted_status')->nullable();

            $table->timestamp('quoted_created_at');
            $table->unsignedBigInteger('quoted_tweet_id')->nullable();
            $table->unsignedBigInteger('quoted_page_id')->nullable();
            $table->string('quoted_full_text')->nullable();
            $table->bigInteger('quoted_favorite_count')->nullable();
            $table->bigInteger('quoted_retweet_count')->nullable();
            $table->text('quoted_entities')->nullable();
            $table->text('quoted_extended_entities')->nullable();

            $table->timestamp('retweeted_created_at');
            $table->unsignedBigInteger('retweeted_tweet_id')->nullable();
            $table->unsignedBigInteger('retweeted_page_id')->nullable();
            $table->string('retweeted_full_text')->nullable();
            $table->bigInteger('retweeted_favorite_count')->nullable();
            $table->bigInteger('retweeted_retweet_count')->nullable();
            $table->text('retweeted_entities')->nullable();
            $table->text('retweeted_extended_entities')->nullable();

            $table->text('tweet_json');
            $table->timestamps();

            $table->foreign('page_id')->references('social_media_id')->on('pages');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tweets');
    }
}
