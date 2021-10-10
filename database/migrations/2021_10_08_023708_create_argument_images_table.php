<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArgumentImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('argument_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('argument_id');
            $table->text('caption')->nullable()->default(null);
            $table->string('s3_link');
            $table->timestamps();

            $table->foreign('argument_id')->references('id')->on('arguments');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('argument_images');
    }
}
