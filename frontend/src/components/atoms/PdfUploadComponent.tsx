import React, { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import FileUploadIcon from "../../icons/FileUploadIcon";

interface PdfUploadComponentProps {
  value?: FileList | File[] | null;
  onFileSelect: (file: File | null) => void;
}

function PdfUploadComponent({ value, onFileSelect }: PdfUploadComponentProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const maxPdfSize = 5 * 1024 * 1024;

  useEffect(() => {
    const file = value instanceof FileList ? value[0] : value?.[0];

    if (!file) {
      setFileName(null);
      setIsUploaded(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } else {
      setFileName(file.name);
      setIsUploaded(true);
    }
  }, [value]);

  const resetState = () => {
    onFileSelect(null);
    setFileName(null);
    setIsUploaded(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      resetState();
      return;
    }

    const isPdf = file.type === "application/pdf";
    const isSizeOk = file.size <= maxPdfSize;

    if (!isPdf) {
      alert("Si us plau, selecciona un fitxer PDF.");
      resetState();
      return;
    }

    if (!isSizeOk) {
      alert(
        "El fitxer triat és massa gran. Pots pujar fitxers de fins a 5 MB.",
      );
      resetState();
      return;
    }
    setFileName(file.name);
    setIsUploaded(true);
    onFileSelect(file);
  };

  return (
    <div className="max-w-sm">
      <div className="flex items-center justify-between border border-gray-300 rounded-[12px] p-2">
        <span
          className={`truncate text-sm p-2 rounded-[12px] w-3/4 flex items-center ${isUploaded && "text-black"}`}
        >
          {fileName && <FileUploadIcon className="text-primary mr-1" />}
          {fileName ? fileName : "Cap fitxer seleccionat"}
        </span>

        <div className="ml-2">
          {isUploaded ? (
            <div className="bg-green-700 p-1 rounded-full">
              <FaCheck className="text-white text-xs" />
            </div>
          ) : (
            <button
              type="button"
              onClick={handleClick}
              className="p-3 bg-primary text-white text-sm rounded-[12px] cursor-pointer"
            >
              Cerca
            </button>
          )}
        </div>
      </div>

      <input
        type="file"
        accept="application/pdf"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default PdfUploadComponent;
