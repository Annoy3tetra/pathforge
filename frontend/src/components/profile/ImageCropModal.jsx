import { memo, useCallback, useEffect, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "../ui/Button";

export const ImageCropModal = memo(function ImageCropModal({
  isOpen,
  onClose,
  imageFile,
  aspectRatio = 1, // 1 for 1:1 square, 3 for 3:1 banner
  onCropComplete
}) {
  const [imgSrc, setImgSrc] = useState("");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Load image file into a data URL
  useEffect(() => {
    if (!imageFile) return;
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result);
    reader.readAsDataURL(imageFile);
    
    // Reset state
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [imageFile]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  }, [offset]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch Support
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - offset.x,
      y: e.touches[0].clientY - offset.y
    });
  }, [offset]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleSave = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const container = containerRef.current;
    
    // Calculate cropping area dimensions based on container aspect ratio
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Define the crop box (centered in the container)
    let cropWidth = containerWidth * 0.85;
    let cropHeight = cropWidth / aspectRatio;
    
    if (cropHeight > containerHeight * 0.85) {
      cropHeight = containerHeight * 0.85;
      cropWidth = cropHeight * aspectRatio;
    }
    
    const cropX = (containerWidth - cropWidth) / 2;
    const cropY = (containerHeight - cropHeight) / 2;

    // Create a hidden canvas
    const canvas = document.createElement("canvas");
    canvas.width = aspectRatio === 1 ? 400 : 1200;
    canvas.height = aspectRatio === 1 ? 400 : 400;
    const ctx = canvas.getContext("2d");

    // Calculate source rect from natural image dimensions
    const rect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Map offset and scaling
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const sx = (cropX - rect.left + containerRect.left) * scaleX;
    const sy = (cropY - rect.top + containerRect.top) * scaleY;
    const sWidth = cropWidth * scaleX;
    const sHeight = cropHeight * scaleY;

    // Draw image onto canvas
    ctx.drawImage(
      img,
      sx, sy, sWidth, sHeight,  // source coordinates
      0, 0, canvas.width, canvas.height // destination coordinates
    );

    // Convert canvas to blob and return file
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], imageFile.name, { type: imageFile.type });
        onCropComplete(croppedFile);
      }
    }, imageFile.type, 0.95);
  }, [imageFile, aspectRatio, onCropComplete]);

  if (!isOpen || !imageFile) return null;

  // Render crop box style
  const getCropBoxStyle = () => {
    if (aspectRatio === 1) {
      return "h-64 w-64 rounded-full border-2 border-dashed border-white shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] relative z-20 pointer-events-none";
    }
    return "h-32 w-96 max-w-full rounded-xl border-2 border-dashed border-white shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] relative z-20 pointer-events-none";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {aspectRatio === 1 ? "Crop Profile Picture" : "Crop Banner Image"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Workspace */}
        <div 
          ref={containerRef}
          className="h-80 bg-slate-950 relative overflow-hidden flex items-center justify-center cursor-move touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {imgSrc && (
            <img
              ref={imageRef}
              src={imgSrc}
              alt="Source"
              className="max-h-full max-w-none select-none pointer-events-none absolute"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transition: isDragging ? "none" : "transform 0.1s ease-out",
              }}
            />
          )}
          
          <div className={getCropBoxStyle()} />
        </div>

        {/* Controls */}
        <div className="px-6 py-4 space-y-4 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <ZoomOut size={16} className="text-slate-400" />
            <input
              type="range"
              min="0.5"
              max="4"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <ZoomIn size={16} className="text-slate-400" />
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={onClose} className="px-4">
              Cancel
            </Button>
            <Button onClick={handleSave} className="px-6">
              Crop & Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
