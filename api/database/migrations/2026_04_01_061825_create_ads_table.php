<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ads', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('city');
            $table->float('lat')->index();
            $table->float('lng')->index();
            $table->text('description');
            $table->string('image')->nullable();
            $table->timestamps();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
        });
        DB::unprepared('DROP FUNCTION IF EXISTS DISTANCE');
        DB::unprepared('
            CREATE FUNCTION DISTANCE (lat1 FLOAT, lng1 FLOAT, lat2 FLOAT, lng2 FLOAT)
            RETURNS FLOAT
            DETERMINISTIC
            BEGIN
                RETURN ACOS(SIN(RADIANS(lat1))*SIN(RADIANS(lat2))+COS(RADIANS(lat1))*COS(RADIANS(lat2))*COS(RADIANS(lng1-lng2)))*6371;
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ads');
    }
};
