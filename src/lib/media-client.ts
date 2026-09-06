export type PreparedMedia = {
  kind: "image" | "video";
  mime: string;
  dataB64: string;
};

const MAX_FILES = 4;
const MAX_IMAGE_EDGE = 1080;
const JPEG_QUALITY = 0.74;
const MAX_VIDEO_BYTES = 2_400_000;
const MAX_VIDEO_SECONDS = 20;

export function mediaLimitLabel() {
  return "Fino a 4 immagini, oppure 1 video (max 20s / 2,4 MB).";
}

export async function prepareFiles(files: File[]): Promise<PreparedMedia[]> {
  if (files.length === 0) return [];
  const list = files.slice(0, MAX_FILES);
  const hasVideo = list.some((f) => f.type.startsWith("video/"));
  if (hasVideo && list.length > 1) {
    throw new Error("Un video per post, senza altre immagini.");
  }
  const out: PreparedMedia[] = [];
  for (const file of list) {
    if (file.type.startsWith("image/")) {
      out.push(await compressImage(file));
    } else if (file.type.startsWith("video/")) {
      out.push(await readVideo(file));
    } else {
      throw new Error("Formato non supportato. Usa immagini o video.");
    }
  }
  return out;
}

async function compressImage(file: File): Promise<PreparedMedia> {
  const bitmap = await loadImage(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Impossibile preparare l'immagine.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  if ("close" in bitmap && typeof bitmap.close === "function") bitmap.close();
  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  return { kind: "image", mime: "image/jpeg", dataB64: stripDataUrl(dataUrl) };
}

function loadImage(file: File): Promise<HTMLImageElement | ImageBitmap> {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file);
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Immagine non valida."));
    };
    img.src = url;
  });
}

async function readVideo(file: File): Promise<PreparedMedia> {
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error("Video troppo pesante. Max 2,4 MB.");
  }
  const duration = await videoDuration(file);
  if (duration > MAX_VIDEO_SECONDS) {
    throw new Error("Video troppo lungo. Max 20 secondi.");
  }
  const dataUrl = await fileToDataUrl(file);
  return {
    kind: "video",
    mime: file.type || "video/mp4",
    dataB64: stripDataUrl(dataUrl),
  };
}

function videoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const d = video.duration;
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(d) ? d : 0);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Video non valido."));
    };
    video.src = url;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Lettura file non riuscita."));
    reader.readAsDataURL(file);
  });
}

function stripDataUrl(dataUrl: string): string {
  const idx = dataUrl.indexOf("base64,");
  return idx >= 0 ? dataUrl.slice(idx + 7) : dataUrl;
}
