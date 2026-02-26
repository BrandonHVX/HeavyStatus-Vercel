'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface GalleryImage {
  src: string;
  alt: string;
  title: string;
  postSlug: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, goToPrevious, goToNext]);

  if (images.length === 0) {
    return <p>No photos found in the Photo Library.</p>;
  }

  return (
    <>
      <div>
        {images.map((image, index) => (
          <div
            key={`${image.postSlug}-${index}`}
            onClick={() => openLightbox(index)}
            style={{ cursor: 'pointer', display: 'inline-block' }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={200}
              height={200}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 200px"
            />
            <p>{image.title}</p>
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.9)' }} onClick={closeLightbox}>
          <button onClick={closeLightbox} aria-label="Close lightbox" style={{ position: 'absolute', top: 16, right: 16, color: 'white', background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>
            ✕
          </button>
          <button onClick={(e) => { e.stopPropagation(); goToPrevious(); }} aria-label="Previous image" style={{ position: 'absolute', left: 16, top: '50%', color: 'white', background: 'none', border: 'none', fontSize: 32, cursor: 'pointer' }}>
            &larr;
          </button>
          <button onClick={(e) => { e.stopPropagation(); goToNext(); }} aria-label="Next image" style={{ position: 'absolute', right: 16, top: '50%', color: 'white', background: 'none', border: 'none', fontSize: 32, cursor: 'pointer' }}>
            &rarr;
          </button>
          <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              width={800}
              height={600}
              sizes="100vw"
              priority
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain' }}
            />
          </div>
          <div style={{ position: 'absolute', bottom: 16, width: '100%', textAlign: 'center', color: 'white' }}>
            <p>{images[currentIndex].title}</p>
            <p>{currentIndex + 1} / {images.length}</p>
          </div>
        </div>
      )}
    </>
  );
}
