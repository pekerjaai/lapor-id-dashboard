import { Skeleton } from "@heroui/skeleton";
import clsx from "clsx";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import "filepond/dist/filepond.min.css";
import { useTranslations } from "next-intl";
import { FilePond, registerPlugin } from "react-filepond";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImageResize,
  FilePondPluginImageCrop,
);

interface FileUploaderProps {
  files: File[];
  setFiles: (files: File[]) => void;
  resize?: boolean;
  imageType: "profile" | "task" | "announcement";
  legend?: string;
  isLoading?: boolean;
  className?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
}

export const FileUploader = ({
  files,
  setFiles,
  resize = true,
  imageType,
  className,
  isLoading = false,
  isRequired = false,
  isDisabled = false,
  legend,
}: FileUploaderProps) => {
  const t = useTranslations("FileUploader");
  const allowCrop = imageType !== "task";
  const imageCropRatio = imageType === "profile" ? "1:1" : "16:9";
  const additionalProps = {
    imageResizeTargetWidth: imageType === "profile" ? 512 : 2560,
    imageResizeTargetHeight: imageType === "profile" ? 512 : 1440,
    imageCropAspectRatio: allowCrop ? imageCropRatio : undefined,
  };

  return (
    <div>
      <Skeleton className="w-full rounded-xl" isLoaded={!isLoading}>
        <FilePond
          className={clsx(
            "bg-default-50 rounded-xl overflow-hidden",
            className,
          )}
          files={files}
          allowImageResize={resize}
          disabled={isDisabled}
          allowImageCrop={allowCrop}
          maxFileSize="2MB"
          stylePanelLayout="integrated"
          acceptedFileTypes={["image/*"]}
          labelMaxFileSizeExceeded={t("max-file-size-exceeded-error")}
          labelMaxFileSize={`${t("max-file-size-error")} {filesize}`}
          labelFileTypeNotAllowed={t("file-type-not-allowed-error")}
          fileValidateTypeLabelExpectedTypes={t(
            "file-type-expected-types-error",
          )}
          onupdatefiles={(files) => {
            const transformedFiles = files
              .map((file) => file.file as File)
              .filter((file) => file.type.includes("image"));
            setFiles(transformedFiles);
          }}
          labelIdle={`${t("upload-input-dragndrop-text")} <span class="filepond--label-action">${t("upload-input-browse-text")}</span><span class="text-red-500 ${isRequired ? "" : "hidden"}">*</span>`}
          {...(resize ? additionalProps : {})}
        />
      </Skeleton>
      {legend && (
        <p className="text-default-500 text-xs text-center pt-3">{legend}</p>
      )}
    </div>
  );
};
