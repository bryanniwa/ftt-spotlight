<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClustersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clusters', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('cluster_id');
            $table->unsignedInteger('student_id');
            $table->timestamps();
            // Foreign keys
            $table->foreign('cluster_id')->references('id')->on('cluster_legend');
            $table->foreign('student_id')->references('id')->on('students');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clusters');
    }
}
