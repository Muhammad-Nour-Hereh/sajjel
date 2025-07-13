<?php

namespace App\Services;

class ThumbnailService
{
    public function store(?string $oldPath, UploadedFile $file): string
    {
        // Delete old thumbnail if it exists
        if ($oldPath) {
            Storage::disk('public')->delete($oldPath);
        }

        // Store new thumbnail
        return $file->store('thumbnails', 'public');
    }

    public function updateThumbnail(UpdateItemThumbnailRequest $request, $id, ThumbnailService $thumbnailService)
    {
        $item = Item::find($id);
        if (!$item) {
            return $this->notFoundResponse();
        }

        if ($request->hasFile('thumbnail')) {
            $path = $thumbnailService->store($item->thumbnail, $request->file('thumbnail'));
            $item->thumbnail = $path;
            $item->save();
        }

        return $this->successResponse(['thumbnail' => $item->thumbnail]);
    }
}
