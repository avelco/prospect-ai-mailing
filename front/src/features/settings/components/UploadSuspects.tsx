// UploadSuspects.tsx
import React, { useRef, useState } from "react";
import { FaCloudUploadAlt, FaFileCsv, FaTimes } from "react-icons/fa";
import { useSuspectMutation } from "../../../hooks/useSuspectMutation";

const UploadSuspects: React.FC = () => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const mutation = useSuspectMutation();

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = (selectedFile: File) => {
        if (selectedFile.type !== "text/csv") {
            setError("Por favor, sube un archivo CSV válido.");
            setFile(null);
            return;
        }
        setFile(selectedFile);
        setError(null);
        setSuccess(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setFile(null);
        setError(null);
        setSuccess(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleUpload = async () => {
        if (!file) return;
        setError(null);
        setSuccess(null);

        mutation.mutate(file, {
            onSuccess: () => {
                setSuccess("Archivo subido exitosamente.");
                setFile(null);
                if (inputRef.current) inputRef.current.value = "";
            },
            onError: (err: any) => {
                setError(err.message || "Error al subir el archivo.");
            },
        });
    };

    return (
        <div className="w-full max-w-md mx-auto mt-12">
            <div
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-colors duration-200
          ${dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white"
                    }
          p-8 cursor-pointer`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleChange}
                />
                {!file ? (
                    <>
                        <FaCloudUploadAlt className="text-5xl text-blue-400 mb-4" />
                        <p className="text-lg font-semibold text-gray-700 mb-1">
                            Arrastra y suelta tu archivo CSV
                        </p>
                        <p className="text-gray-500 text-sm mb-2">
                            o <span className="text-blue-600 underline">explora</span> para subir
                        </p>
                        <span className="text-xs text-gray-400">
                            Solo archivos .csv son soportados
                        </span>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <FaFileCsv className="text-4xl text-green-500" />
                        <span className="text-gray-700 font-medium">{file.name}</span>
                        <button
                            type="button"
                            onClick={removeFile}
                            className="flex items-center gap-1 text-red-500 hover:underline text-sm mt-2"
                            disabled={mutation.isPending}
                        >
                            <FaTimes /> Quitar
                        </button>
                    </div>
                )}
                {error && (
                    <div className="absolute bottom-2 left-0 right-0 text-center text-red-500 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="absolute bottom-2 left-0 right-0 text-center text-green-600 text-sm">
                        {success}
                    </div>
                )}
            </div>
            {file && (
                <button
                    className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                    onClick={handleUpload}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Subiendo..." : "Subir CSV"}
                </button>
            )}
        </div>
    );
};

export default UploadSuspects;
