<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sector extends Model
{
    protected $fillable = ['name', 'slug', 'image_url'];

    public function categories()
    {
        return $this->hasMany(OfferCategory::class);
    }
}
