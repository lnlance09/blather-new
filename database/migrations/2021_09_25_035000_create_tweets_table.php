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

            $table->string('tweet_id')->unique();
            $table->unsignedBigInteger('page_id');
            $table->text('full_text');
            $table->bigInteger('favorite_count')->nullable();
            $table->bigInteger('retweet_count')->nullable();
            $table->text('entities')->nullable();
            $table->text('extended_entities')->nullable();
            $table->integer('quoted_status')->nullable();
            $table->integer('retweeted_status')->nullable();

            $table->timestamp('quoted_created_at')->nullable()->default(null);
            $table->string('quoted_tweet_id')->nullable()->default(null);
            $table->unsignedBigInteger('quoted_page_id')->nullable()->default(null);
            $table->text('quoted_full_text')->nullable()->default(null);
            $table->bigInteger('quoted_favorite_count')->nullable()->default(null);
            $table->bigInteger('quoted_retweet_count')->nullable()->default(null);
            $table->text('quoted_entities')->nullable()->default(null);
            $table->text('quoted_extended_entities')->nullable()->default(null);

            $table->timestamp('retweeted_created_at')->nullable()->default(null);
            $table->string('retweeted_tweet_id')->nullable()->default(null);
            $table->unsignedBigInteger('retweeted_page_id')->nullable()->default(null);
            $table->text('retweeted_full_text')->nullable()->default(null);
            $table->bigInteger('retweeted_favorite_count')->nullable()->default(null);
            $table->bigInteger('retweeted_retweet_count')->nullable()->default(null);
            $table->text('retweeted_entities')->nullable()->default(null);
            $table->text('retweeted_extended_entities')->nullable()->default(null);

            $table->text('tweet_json');
            $table->timestamps();

            $table->foreign('page_id')->references('id')->on('pages');
            $table->foreign('quoted_page_id')->references('id')->on('pages');
            $table->foreign('retweeted_page_id')->references('id')->on('pages');
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
