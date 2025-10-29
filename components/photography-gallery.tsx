"use client";

import { useState } from "react";
import { X, Camera, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotographyGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PhotographyGallery({ isOpen, onClose }: PhotographyGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const photos = [
    { src: "/IMG_6411.jpg", location: "China" },
    { src: "/IMG_6343.jpg", location: "China" },
    { src: "/IMG_6273.jpg", location: "China" },
    { src: "/IMG_5969.jpg", location: "China" },
    { src: "/IMG_5966.jpg", location: "China" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Camera className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Photography</h2>
              <p className="text-sm text-gray-400">Captured moments through my lens</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-white/10 text-white"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Masonry Gallery */}
      <div className="container mx-auto px-4 py-8">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {photos.map((photo, idx) => (
            <div
              key={idx}
              className="relative break-inside-avoid group cursor-pointer"
              onClick={() => setSelectedPhoto(idx)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end justify-center pb-6">
                  <div className="flex items-center gap-2 text-white">
                    <ZoomIn className="h-5 w-5" />
                    <span className="text-sm font-medium">View Full Size</span>
                  </div>
                </div>
                
                {/* Image */}
                <img
              src={photo.src}
              alt={`Photo from ${photo.location}`}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Location overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">📍</span>
                    <p className="text-purple-300 text-sm font-semibold">{photo.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/98 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(null);
            }}
            className="absolute top-4 right-4 rounded-full hover:bg-white/10 text-white z-10"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation Arrows */}
          {selectedPhoto > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(selectedPhoto - 1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full hover:bg-white/10 text-white h-12 w-12"
            >
              <span className="text-2xl">←</span>
            </Button>
          )}
          
          {selectedPhoto < photos.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(selectedPhoto + 1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full hover:bg-white/10 text-white h-12 w-12"
            >
              <span className="text-2xl">→</span>
            </Button>
          )}

          {/* Full size image */}
          <div className="relative max-w-7xl max-h-[90vh]">
            <img
              src={photos[selectedPhoto].src}
              alt={photos[selectedPhoto].caption}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Location and counter */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent rounded-b-lg">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">📍</span>
                <p className="text-purple-300 text-xl font-bold">
                  {photos[selectedPhoto].location}
                </p>
              </div>
              <p className="text-gray-400 text-sm text-center mt-2">
                {selectedPhoto + 1} of {photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

