"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addProductSchema, type AddProductInput } from "@/lib/product-schemas";
import { PRODUCT_CATEGORIES } from "@/lib/store/products";
import { updateProduct, type SellerProduct } from "@/lib/seller";
import { API_URL } from "@/lib/auth";

type View = "loading" | "form" | "saving" | "success";

type ProductDetail = SellerProduct & { imageUrls?: string[] };

export function EditProductContent({
  sellerId,
  productId,
}: {
  sellerId: string;
  productId: string;
}) {
  const router = useRouter();

  const [view, setView] = useState<View>("loading");
  const [submitError, setSubmitError] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageUrlsExtra, setImageUrlsExtra] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddProductInput>({
    resolver: zodResolver(addProductSchema) as import("react-hook-form").Resolver<AddProductInput>,
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "general",
      imageUrl: "",
    },
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(
          `${API_URL}/api/products/${encodeURIComponent(productId)}`
        );
        console.log(res)
        const data = await res.json();
        if (!res.ok || !data.product) {
          setSubmitError(data.error ?? "Failed to load product");
          setView("form");
          return;
        }
        const p = data.product as ProductDetail;
        setValue("title", p.title);
        setValue("description", p.description);
        setValue("price", p.price);
        setValue("category", (p.category ?? "general") as AddProductInput["category"]);
        if (p.imageUrl) {
          setValue("imageUrl", p.imageUrl);
          setImagePreviewUrl(p.imageUrl);
        }
        if (Array.isArray(p.imageUrls) && p.imageUrls.length > 0) {
          setImageUrlsExtra(p.imageUrls);
        }
        setView("form");
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : "Failed to load product");
        setView("form");
      }
    }

    loadProduct();
  }, [productId, setValue]);

  function removeExtraImage(index: number) {
    setImageUrlsExtra((prev) => {
      const next = prev.filter((_, i) => i !== index);
      const mainUrl = watch("imageUrl");
      const removedUrl = prev[index];
      if (next.length === 0) {
        setValue("imageUrl", "");
        setImagePreviewUrl(null);
        return [];
      }
      if (removedUrl === mainUrl) {
        const newMain = next[0];
        setValue("imageUrl", newMain);
        setImagePreviewUrl(newMain);
      }
      return next;
    });
  }

  async function onSubmit(data: AddProductInput) {
    setSubmitError("");
    setView("saving");
    try {
      const imageUrls =
        imageUrlsExtra.length > 0
          ? imageUrlsExtra
          : data.imageUrl
            ? [data.imageUrl]
            : undefined;
      await updateProduct(productId, {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl,
        ...(imageUrls ? { imageUrls } : {}),
      });
      setView("success");
      setTimeout(() => {
        router.push(`/seller/${sellerId}`);
        router.refresh();
      }, 1500);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to update product");
      setView("form");
    }
  }

  if (view === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading product…</p>
        </div>
      </div>
    );
  }

  if (view === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Package className="size-7" />
            </div>
            <p className="font-medium">Product updated successfully.</p>
            <p className="text-sm text-muted-foreground">Redirecting to dashboard…</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-xl space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/seller/${sellerId}`} className="gap-2">
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Package className="size-6" />
                </div>
                <div>
                  <CardTitle>Edit product</CardTitle>
                  <CardDescription>
                    Update the details of your product. All fields with * are required.
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {submitError && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {submitError}
                </p>
              )}

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title *
                </label>
                <Input
                  id="title"
                  placeholder="e.g. Wireless Headphones"
                  {...register("title")}
                  aria-invalid={!!errors.title}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description *
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe your product in detail..."
                  rows={5}
                  {...register("description")}
                  aria-invalid={!!errors.description}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price *
                </label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("price")}
                  aria-invalid={!!errors.price}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category *
                </label>
                <Select
                  value={watch("category")}
                  onValueChange={(v) => setValue("category", v as AddProductInput["category"])}
                >
                  <SelectTrigger id="category" className="w-full" aria-invalid={!!errors.category}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Product image (optional)
                </label>
                {imageUrlsExtra.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {imageUrlsExtra.length} image
                      {imageUrlsExtra.length !== 1 ? "s" : ""} associated with this product. First is
                      main.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {imageUrlsExtra.map((url, index) => (
                        <div key={url + index} className="relative inline-block">
                          <button
                            type="button"
                            onClick={() => {
                              if (watch("imageUrl") !== url) {
                                setValue("imageUrl", url);
                                setImagePreviewUrl(url);
                              }
                            }}
                            className={`block rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                              watch("imageUrl") === url
                                ? "border-primary ring-1 ring-primary"
                                : "border-muted hover:border-primary/50"
                            }`}
                          >
                            <img
                              src={url}
                              alt={`Product ${index + 1}`}
                              className="h-28 w-28 rounded-md object-cover sm:h-32 sm:w-32"
                            />
                          </button>
                          {watch("imageUrl") === url && (
                            <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                              Main
                            </span>
                          )}
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="absolute -right-1 -top-1 size-6 rounded-full shadow sm:size-7"
                            onClick={() => removeExtraImage(index)}
                            aria-label={`Remove image ${index + 1}`}
                          >
                            <X className="size-3 sm:size-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => {
                        setValue("imageUrl", "");
                        setImagePreviewUrl(null);
                        setImageUrlsExtra([]);
                        setUploadError("");
                      }}
                    >
                      Clear all images
                    </Button>
                  </div>
                ) : imagePreviewUrl || watch("imageUrl") ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreviewUrl || watch("imageUrl") || ""}
                      alt="Preview"
                      className="h-40 w-40 rounded-lg border object-cover"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute -right-2 -top-2 size-8 rounded-full shadow"
                      onClick={() => {
                        setValue("imageUrl", "");
                        setImagePreviewUrl(null);
                        setImageUrlsExtra([]);
                        setUploadError("");
                      }}
                      aria-label="Remove image"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Images are managed from the product creation or AI tools.
                  </p>
                )}
                {uploadError && (
                  <p className="text-xs text-destructive">{uploadError}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/seller/${sellerId}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || view === "saving"}>
                {view === "saving" ? "Saving…" : "Save changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
