<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVideosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('page_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('thumbnail')->nullable();
            $table->bigInteger('view_count')->nullable();
            $table->bigInteger('like_count')->nullable();
            $table->bigInteger('dislike_count')->nullable();
            $table->timestamp('date_created');
            $table->string('video_id')->unique();
            $table->string('s3_link')->nullable()->default(null);
            $table->timestamps();

            $table->foreign('page_id')->references('id')->on('pages');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('videos');
    }
}
