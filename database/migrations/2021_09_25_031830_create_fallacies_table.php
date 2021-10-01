<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFallaciesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fallacies', function (Blueprint $table) {
            $table->id();
            $table->string('slug');
            $table->text('title');
            $table->text('explanation');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('page_id');
            $table->unsignedBigInteger('ref_id');
            $table->boolean('retracted')->default(0);
            $table->integer('status')->default(0);
            $table->string('s3_link')->nullable()->default(null);
            $table->bigInteger('views')->default(1);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('page_id')->references('id')->on('pages');
            $table->foreign('ref_id')->references('id')->on('reference');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fallacies');
    }
}
