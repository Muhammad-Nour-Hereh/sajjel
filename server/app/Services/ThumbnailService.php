<?php

namespace App\Services;

use Storage;

class ThumbnailService
{
    public function replace(?string $oldPath, $file): string
    {
        if ($oldPath) {
            Storage::disk('public')->delete($oldPath);
        }

        return $file->store('thumbnails', 'public');
    }
}
