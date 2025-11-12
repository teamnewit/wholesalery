<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\SubscriptionsController;
use App\Http\Controllers\Admin\OfferModerationController;
use App\Http\Controllers\MarketplaceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public subscriptions page
Route::get('subscriptions', function () {
    return Inertia::render('subscriptions/index');
})->name('subscriptions');

// Wholesale Marketplace
Route::get('/wholesale-marketplace', [MarketplaceController::class, 'index'])->name('marketplace.index');
Route::get('/category/{sectorSlug}/{categorySlug}', [MarketplaceController::class, 'category'])->name('marketplace.category');
// JSON for marketplace search
Route::get('/api/categories', [MarketplaceController::class, 'categories']);

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Offer management
    Route::get('offers/create', [DashboardController::class, 'create'])->name('offers.create');
    Route::post('offers', [DashboardController::class, 'store'])->name('offers.store');
    Route::get('offers/{offer}/edit', [DashboardController::class, 'edit'])->name('offers.edit');
    Route::put('offers/{offer}', [DashboardController::class, 'update'])->name('offers.update');
    Route::delete('offers/{offer}', [DashboardController::class, 'destroy'])->name('offers.destroy');
    
    // File uploads
    Route::post('upload/image', [FileUploadController::class, 'upload'])->name('upload.image');

    // Subscriptions - select plan
    Route::post('subscriptions/select', [SubscriptionsController::class, 'select'])->name('subscriptions.select');

    // Admin moderation
    Route::prefix('admin')->group(function () {
        // Admin home
        Route::get('/', function () {
            if (! auth()->user()?->is_admin) {
                abort(403);
            }
            return Inertia::render('admin/index');
        })->name('admin.index');

        // Moderation
        Route::get('moderation', [OfferModerationController::class, 'index'])->name('admin.moderation.index');
        Route::post('offers/{offer}/approve', [OfferModerationController::class, 'approve'])->name('admin.offers.approve');
        Route::post('offers/{offer}/reject', [OfferModerationController::class, 'reject'])->name('admin.offers.reject');
        
        // Users
        Route::get('users', [\App\Http\Controllers\Admin\UsersController::class, 'index'])->name('admin.users.index');

        // Sectors
        Route::get('sectors', [\App\Http\Controllers\Admin\SectorsController::class, 'index'])->name('admin.sectors.index');
        Route::post('sectors', [\App\Http\Controllers\Admin\SectorsController::class, 'store'])->name('admin.sectors.store');
        Route::put('sectors/{sector}', [\App\Http\Controllers\Admin\SectorsController::class, 'update'])->name('admin.sectors.update');
        Route::delete('sectors/{sector}', [\App\Http\Controllers\Admin\SectorsController::class, 'destroy'])->name('admin.sectors.destroy');

        // Categories
        Route::get('categories', [\App\Http\Controllers\Admin\CategoriesController::class, 'index'])->name('admin.categories.index');
        Route::post('categories', [\App\Http\Controllers\Admin\CategoriesController::class, 'store'])->name('admin.categories.store');
        Route::put('categories/{category}', [\App\Http\Controllers\Admin\CategoriesController::class, 'update'])->name('admin.categories.update');
        Route::delete('categories/{category}', [\App\Http\Controllers\Admin\CategoriesController::class, 'destroy'])->name('admin.categories.destroy');
        Route::post('categories/bulk-move', [\App\Http\Controllers\Admin\CategoriesController::class, 'bulkMove'])->name('admin.categories.bulk-move');
        Route::post('categories/bulk-delete', [\App\Http\Controllers\Admin\CategoriesController::class, 'bulkDestroy'])->name('admin.categories.bulk-delete');
    });
});

// Public offer viewing route - must be after the create route to avoid conflicts
Route::get('offers/{id}', function ($id) {
    return Inertia::render('Offers/Show', ['id' => $id]);
})->name('offers.show');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
