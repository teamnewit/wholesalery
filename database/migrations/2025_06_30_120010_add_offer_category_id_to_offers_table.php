<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('offers', function (Blueprint $table) {
            $table->unsignedBigInteger('offer_category_id')->nullable()->after('image_url');
            $table->foreign('offer_category_id')->references('id')->on('offer_categories')->nullOnDelete();
            $table->dropColumn('offer_sector');
        });
    }

    public function down()
    {
        Schema::table('offers', function (Blueprint $table) {
            $table->string('offer_sector')->nullable()->after('image_url');
            $table->dropForeign(['offer_category_id']);
            $table->dropColumn('offer_category_id');
        });
    }
};
