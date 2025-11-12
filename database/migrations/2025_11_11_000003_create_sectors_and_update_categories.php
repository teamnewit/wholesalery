<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('sectors')) {
            Schema::create('sectors', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->timestamps();
            });
        }

        Schema::table('offer_categories', function (Blueprint $table) {
            if (!Schema::hasColumn('offer_categories', 'sector_id')) {
                $table->foreignId('sector_id')->nullable()->constrained('sectors')->nullOnDelete();
            }
            if (!Schema::hasColumn('offer_categories', 'slug')) {
                $table->string('slug')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('offer_categories', function (Blueprint $table) {
            if (Schema::hasColumn('offer_categories', 'sector_id')) {
                $table->dropConstrainedForeignId('sector_id');
            }
            // do not drop slug to avoid data loss if already used
        });

        Schema::dropIfExists('sectors');
    }
};
