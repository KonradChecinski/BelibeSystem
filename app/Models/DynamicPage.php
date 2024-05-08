<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class DynamicPage extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        "title",
        "slug",
        "content",
        "is_active",
    ];

    protected $casts = [
        "content" => "array", // "content" is a JSON field in the database, so we need to cast it to an array
        "is_active" => "boolean",
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug')
//            ->skipGenerateWhen(fn() => $this->slug !== '');
            ->preventOverwrite();
    }
}
