<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image_url',
        'user_id',
        'offer_category_id',
        'status',
        'rejection_reason',
        'published_at',
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function category()
    {
        return $this->belongsTo(OfferCategory::class, 'offer_category_id');
    }
}
