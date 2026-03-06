"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Check, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface Collection {
  id: string;
  name: string;
  slug: string;
}

function getDomain(url: string | null) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return null;
  }
}

function WishPreview({
  title,
  url,
  imageUrl,
  price,
}: {
  title: string;
  url: string;
  imageUrl: string;
  price: string;
}) {
  const domain = getDomain(url);
  const hasContent = title || imageUrl || price;

  if (!hasContent) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center p-8 text-center min-h-[280px]">
        <Gift className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground/60">
          Your wish will appear here...
        </p>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col rounded-lg overflow-hidden border border-border bg-card shadow-sm">
      {/* Image */}
      <div className="block overflow-hidden bg-muted/30">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full aspect-[4/3] flex items-center justify-center">
            <span className="text-2xl text-muted-foreground/20">?</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2 flex flex-col gap-0.5 flex-1">
        <h3 className="text-xs font-medium leading-tight line-clamp-2">
          {title || "Untitled wish"}
        </h3>
        <div className="flex items-center justify-between mt-auto pt-0.5">
          {domain && (
            <span className="text-[10px] text-muted-foreground truncate">
              {domain}
            </span>
          )}
          {price && (
            <span className="text-xs font-semibold tabular-nums ml-auto">
              {parseFloat(price).toFixed(2)}&euro;
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AddPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sharedUrl = searchParams.get("url") || searchParams.get("text") || "";
  const preselectedCollectionId = searchParams.get("collectionId") || "";

  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [loadingCollections, setLoadingCollections] = useState(true);

  const [url, setUrl] = useState(sharedUrl);
  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [scraping, setScraping] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch collections
  useEffect(() => {
    fetch("/api/collections")
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
        if (preselectedCollectionId && data.some((c: Collection) => c.id === preselectedCollectionId)) {
          setSelectedCollectionId(preselectedCollectionId);
        } else if (data.length > 0) {
          setSelectedCollectionId(data[0].id);
        }
      })
      .catch(() => toast.error("Failed to load collections"))
      .finally(() => setLoadingCollections(false));
  }, []);

  // Scrape URL
  const scrapeUrl = useCallback(async (targetUrl: string) => {
    if (!targetUrl) return;
    try {
      new URL(targetUrl);
    } catch {
      return;
    }

    setScraping(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.title) setTitle(data.title);
        if (data.description) setDescription(data.description);
        const bestImage = data.imageUrl || data.images?.[0] || "";
        const imgList: string[] = data.images || [];
        if (bestImage && !imgList.includes(bestImage)) {
          imgList.unshift(bestImage);
        }
        if (imgList.length) setImages(imgList);
        if (bestImage) setImageUrl(bestImage);
        if (data.price) setPrice(String(data.price));
        toast.success("Page info loaded!");
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Could not scrape this URL");
      }
    } catch {
      toast.error("Failed to fetch URL");
    }
    setScraping(false);
  }, []);

  // Auto-scrape on mount if URL provided
  useEffect(() => {
    if (sharedUrl) {
      scrapeUrl(sharedUrl);
    }
  }, [sharedUrl, scrapeUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCollectionId) {
      toast.error("Please select a collection");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        url: url || null,
        description: description || null,
        imageUrl: imageUrl || null,
        price: price || null,
        collectionId: selectedCollectionId,
      }),
    });

    if (res.ok) {
      toast.success("Wish added!");
      const collection = collections.find((c) => c.id === selectedCollectionId);
      router.push(collection ? `/collection/${collection.slug}` : "/dashboard");
    } else {
      toast.error("Failed to add wish");
    }
    setSaving(false);
  };

  if (loadingCollections) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <p className="text-muted-foreground text-center">
          You need at least one collection to add a wish.
        </p>
        <Button onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Add a wish</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Save this item to one of your collections.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* URL */}
            <div className="space-y-1.5">
              <Label htmlFor="url">URL</Label>
              <div className="relative">
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData("text");
                    if (pasted) {
                      try {
                        new URL(pasted);
                        setTimeout(() => scrapeUrl(pasted), 0);
                      } catch {}
                    }
                  }}
                  placeholder="https://..."
                />
                {scraping && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Image picker */}
            {images.length > 0 && (
              <div className="space-y-1.5">
                <Label>Select an image</Label>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto rounded-md border p-2">
                  {images.map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setImageUrl(img)}
                      className={cn(
                        "relative aspect-square rounded-md overflow-hidden border-2 transition-all hover:opacity-90",
                        imageUrl === img
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-transparent"
                      )}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                        }}
                      />
                      {imageUrl === img && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you wish for?"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="add-description">Description (optional)</Label>
              <Textarea
                id="add-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Color, size, or any details..."
                rows={2}
              />
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (optional)</Label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="29.99"
                type="number"
                step="0.01"
              />
            </div>

            {/* Collection selector */}
            <div className="space-y-1.5">
              <Label htmlFor="collection">Collection</Label>
              <select
                id="collection"
                value={selectedCollectionId}
                onChange={(e) => setSelectedCollectionId(e.target.value)}
                className="flex h-9 w-full appearance-none rounded-md border border-input bg-transparent pl-3 pr-10 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-[length:16px_16px] bg-[right_0.75rem_center] bg-no-repeat"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
              >
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={saving || scraping}>
              {saving ? "Adding..." : "Add wish"}
            </Button>
          </form>

          {/* Live Preview */}
          <div className="lg:sticky lg:top-20">
            <p className="text-xs font-medium text-muted-foreground mb-2">Preview</p>
            <div className="w-full max-w-[220px] mx-auto lg:max-w-none">
              <WishPreview
                title={title}
                url={url}
                imageUrl={imageUrl}
                price={price}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
