<?php



use App\Http\Controllers\OfferController;

Route::get('offers', [OfferController::class, 'index']);
Route::get('offers/{id}', [OfferController::class, 'show']);
