import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../lib/cropImage'; // Helper function we'll create next
import { X, Check } from 'lucide-react';

export default function ImageCropper({ imageSrc, onCropComplete, onCancel, aspectRatio = 16 / 9 }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
            alert('Kırpma işleminde hata oluştu.');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-4xl h-[80vh] rounded-xl overflow-hidden flex flex-col shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-bold text-gray-700">Resmi Düzenle</h3>
                    <button type="button" onClick={onCancel} className="text-gray-500 hover:text-red-500">
                        <X size={24} />
                    </button>
                </div>

                <div className="relative flex-1 bg-gray-900">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteCallback}
                        onZoomChange={onZoomChange}
                        objectFit="contain"
                    />
                </div>

                <div className="p-6 bg-white border-t flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Yakınlaştır:</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1E3A1A]"
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                        >
                            İptal
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-6 py-2 rounded-lg bg-[#1E3A1A] text-white font-medium hover:bg-[#1E3A1A]/90 transition flex items-center gap-2"
                        >
                            <Check size={18} />
                            Kırp ve Kaydet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
