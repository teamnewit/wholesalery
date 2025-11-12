<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OfferCategory;

class OfferCategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            'Agriculture', 'Apparel & Clothing', 'Chemicals', 'Construction & Real Estate',
            'Consumer Electronics', 'Electrical Equipment', 'Energy', 'Environment',
            'Food & Beverage', 'Furniture', 'Gifts & Crafts', 'Health & Medical',
            'Home Appliances', 'Industrial Equipment', 'Lights & Lighting', 'Machinery',
            'Metallurgy, Chemicals, Rubber & Plastics', 'Minerals & Metallurgy',
            'Office & School Supplies', 'Packaging & Printing', 'Security & Protection',
            'Service Equipment', 'Shoes & Accessories', 'Sports & Entertainment',
            'Telecommunications', 'Textiles & Leather Products', 'Tools & Hardware',
            'Toys', 'Transportation'
        ];

        foreach ($categories as $cat) {
            OfferCategory::firstOrCreate([
                'name' => $cat,
                'slug' => \Str::slug($cat),
            ]);
        }
    }
}
