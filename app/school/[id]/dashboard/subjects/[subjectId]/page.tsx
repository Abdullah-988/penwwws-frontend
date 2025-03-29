"use client";

import { FileUploader } from "@/components/shared/upload/file-uploader";
import { useUploadFile } from "@/hooks/use-upload-file";

export default function SubjectsPage() {
  const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile({
    defaultUploadedFiles: [],
  });

  return (
    <div className="relative flex w-full flex-col gap-8 p-6">
      <FileUploader
        maxFileCount={1}
        maxSize={25 * 1024 * 1024}
        progresses={progresses}
        onUpload={onUpload}
        disabled={isUploading}
      />
      {JSON.stringify(uploadedFiles)}
    </div>
  );
}
