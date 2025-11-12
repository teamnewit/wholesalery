<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Offer; // Make sure this exists!
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed offer categories first
        $this->call(\Database\Seeders\OfferCategorySeeder::class);

        // Note: Factory calls were removed due to errors
        // If you need demo data, please create it through the UI
        // or implement proper factories in database/factories/
    }
}
