<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    public function index()
    {
        return Offer::with(['user', 'category'])
            ->where('status', 'approved')
            ->whereNotNull('published_at')
            ->latest('published_at')
            ->get();
    }
    
    public function show($id)
    {
        return Offer::with(['user', 'category'])
            ->where('status', 'approved')
            ->whereNotNull('published_at')
            ->findOrFail($id);
    }
}
