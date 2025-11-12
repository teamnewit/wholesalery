<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OfferCategory extends Model
{
    protected $fillable = ['name', 'slug', 'sector_id', 'image_url'];

    public function offers()
    {
        return $this->hasMany(Offer::class, 'offer_category_id');
    }

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }
}
