"use client";

import { useState } from "react";
import Image from "next/image";
import { getPublicImageUrl } from "@/lib/images";

type Props = {
  name: string;
  label?: string;
  defaultValue?: string;
};

export function ImageUploadField({ name, label, defaultValue }: Props) {
  const initialValue = defaultValue || "";
  const [url, setUrl] = useState(initialValue);
  const [previewUrl, setPreviewUrl] = useState(
    getPublicImageUrl(initialValue) || initialValue
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const json = await res.json();
      setUrl(json.url); // /uploads/xxx.jpg
      setPreviewUrl(json.publicUrl || json.url);
    } catch (err) {
      setError("Ошибка загрузки. Попробуй другой файл.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-2 text-xs">
      {label && <label className="text-neutral-300">{label}</label>}

      {/* Скрытое поле, которое уйдёт в server action как og_image */}
      <input type="hidden" name={name} value={url} />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-neutral-300
          file:mr-3 file:rounded-lg file:border-none file:bg-white file:px-3 file:py-1
          file:text-xs file:font-medium file:text-black hover:file:bg-neutral-200"
      />

      {isUploading && (
        <p className="text-[11px] text-neutral-400">Загружаем фото…</p>
      )}
      {error && <p className="text-[11px] text-red-400">{error}</p>}

      {url && previewUrl && (
        <div className="mt-2 flex items-center gap-3">
          <div className="relative h-16 w-28 overflow-hidden rounded-lg border border-white/10 bg-black">
            <Image
              src={previewUrl}
              alt="Превью"
              fill
              className="object-cover"
            />
          </div>
          <p className="break-all text-[11px] text-neutral-400">{url}</p>
        </div>
      )}
    </div>
  );
}
