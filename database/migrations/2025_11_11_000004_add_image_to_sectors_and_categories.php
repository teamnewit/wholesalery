<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('sectors', function (Blueprint $table) {
            if (!Schema::hasColumn('sectors', 'image_url')) {
                $table->string('image_url')->nullable()->after('slug');
            }
        });
        Schema::table('offer_categories', function (Blueprint $table) {
            if (!Schema::hasColumn('offer_categories', 'image_url')) {
                $table->string('image_url')->nullable()->after('slug');
            }
        });
    }

    public function down(): void
    {
        Schema::table('offer_categories', function (Blueprint $table) {
            if (Schema::hasColumn('offer_categories', 'image_url')) {
                $table->dropColumn('image_url');
            }
        });
        Schema::table('sectors', function (Blueprint $table) {
            if (Schema::hasColumn('sectors', 'image_url')) {
                $table->dropColumn('image_url');
            }
        });
    }
};
