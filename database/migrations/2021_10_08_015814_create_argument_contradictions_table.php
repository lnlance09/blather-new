<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArgumentContradictionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('argument_contradictions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('argument_id');
            $table->unsignedBigInteger('contradicting_argument_id');
            $table->text('explanation')->nullable()->default(null);
            $table->timestamps();

            $table->foreign('argument_id')->references('id')->on('arguments');
            $table->foreign('contradicting_argument_id')->references('id')->on('arguments');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('argument_contradictions');
    }
}
