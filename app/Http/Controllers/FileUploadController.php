<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $file = $request->file('image');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        
        // Store the file in the public disk under the images/offers directory
        $path = $file->storeAs('images/offers', $filename, 'public');
        
        return response()->json([
            'url' => asset('storage/' . $path),
            'path' => $path,
        ]);
    }
}
