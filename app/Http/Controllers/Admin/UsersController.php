<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        if (!($request->user()?->is_admin)) {
            abort(403);
        }

        $users = User::orderBy('created_at', 'desc')->get(['id', 'name', 'email', 'is_admin', 'plan', 'created_at']);

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }
}
