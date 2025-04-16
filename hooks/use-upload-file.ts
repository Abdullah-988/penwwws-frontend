import * as React from "react";
import { toast } from "sonner";
import axios from "axios";

interface UploadedFile {
  name: string;
  url: string;
  public_id: string;
}

interface UseUploadFileOptions {
  defaultUploadedFiles?: UploadedFile[];
  onUploadBegin?: () => void;
  onUploadProgress?: (progress: number) => void;
}

export function useUploadFile({
  defaultUploadedFiles = [],
  onUploadBegin,
  onUploadProgress,
}: UseUploadFileOptions = {}) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<UploadedFile[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>(
    {},
  );
  const [isUploading, setIsUploading] = React.useState(false);

  async function onUpload(files: File[]) {
    setIsUploading(true);
    onUploadBegin?.();

    try {
      const uploaded: UploadedFile[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
        );

        let resource: string;
        if (file.type.startsWith("image/")) {
          resource = "image";
        } else if (file.type.startsWith("video/")) {
          resource = "video";
        } else {
          resource = "raw";
        }
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resource}/upload`,
          formData,
          {
            onUploadProgress: (event) => {
              const progress = Math.round(
                (event.loaded * 100) / (event.total || 1),
              );
              setProgresses((prev) => ({ ...prev, [file.name]: progress }));
              onUploadProgress?.(progress);
            },
          },
        );

        uploaded.push({
          name: file.name,
          url: res.data.secure_url,
          public_id: res.data.public_id,
        });
      }

      setUploadedFiles((prev) => [...prev, ...uploaded]);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    onUpload,
    uploadedFiles,
    setUploadedFiles,
    progresses,
    isUploading,
  };
}
