import { useState, useEffect } from 'react';
import ImageCropper from './ImageCropper';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUploadWithCrop({ name = "cropped_image", label = "Kapak Görseli", initialImage = "" }) {
    const [selectedFile, setSelectedFile] = useState(null); // The raw file selected by user
    const [croppedImage, setCroppedImage] = useState(initialImage); // The final preview URL (blob or remote)
    const [showCropper, setShowCropper] = useState(false);
    const [croppedBase64, setCroppedBase64] = useState("");

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setSelectedFile(reader.result);
                setShowCropper(true);
                // Reset file input so same file can be selected again if needed
                e.target.value = '';
            });
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = async (croppedBlob) => {
        // Create an Object URL for preview
        const previewUrl = URL.createObjectURL(croppedBlob);
        setCroppedImage(previewUrl);

        // Convert Blob to Base64 to put in hidden input
        const reader = new FileReader();
        reader.readAsDataURL(croppedBlob);
        reader.onloadend = () => {
            setCroppedBase64(reader.result);
        }

        setShowCropper(false);
    };

    useEffect(() => {
        const handleInitialImage = (e) => {
            if (e.detail) {
                setCroppedImage(e.detail);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('set-initial-image', handleInitialImage);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('set-initial-image', handleInitialImage);
            }
        };
    }, []);

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            {/* Hidden Input for Form Submission */}
            <input type="hidden" name={name} value={croppedBase64} />

            <div className="flex flex-col gap-4">
                {/* Preview Area */}
                {croppedImage ? (
                    <div className="relative w-full h-auto bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={croppedImage} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => {
                                setCroppedImage("");
                                setCroppedBase64("");
                                setSelectedFile(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                            title="Görseli Kaldır"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 gap-2">
                        <ImageIcon size={32} />
                        <span className="text-sm">Görsel seçilmedi</span>
                    </div>
                )}

                {/* Upload Button */}
                <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                    <Upload size={18} />
                    <span>{croppedImage ? "Görseli Değiştir" : "Görsel Seç"}</span>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
            </div>

            {showCropper && selectedFile && (
                <ImageCropper
                    imageSrc={selectedFile}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setShowCropper(false)}
                    aspectRatio={16 / 9}
                />
            )}
        </div>
    );
}
