<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('api_token')->nullable()->default(null);
            $table->text('bio')->nullable();
            $table->string('code')->nullable();
            $table->string('email')->nullable()->default(null);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('forgot_code')->nullable()->default(null);
            $table->string('image')->default('');
            $table->string('name');
            $table->string('password');
            $table->string('raw_password');
            $table->rememberToken();
            $table->string('username')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
