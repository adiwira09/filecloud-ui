import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { API_BASE } from '../utils/constants';

export default function GridImageThumbnail({ file }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let objectUrl = null;

    const fetchImage = async () => {
      try {
        setHasError(false);
        setImageUrl(null);

        const res = await fetch(
          `${API_BASE}/api/preview/${file.id}?size=thumb`,
          {
            credentials: 'include',
          }
        );

        if (!res.ok) {
          throw new Error(
            'Failed to load image'
          );
        }

        const contentType =
          res.headers.get('content-type') || '';

        // ===============================================
        // OBJECT STORAGE
        // ===============================================
        if (
          contentType.includes(
            'application/json'
          )
        ) {
          const data = await res.json();

          if (!data.preview_url) {
            throw new Error(
              'Preview URL tidak tersedia'
            );
          }

          if (isMounted) {
            setImageUrl(data.preview_url);
          }

          return;
        }

        // ===============================================
        // LOCAL STORAGE
        // ===============================================
        const blob = await res.blob();

        objectUrl = URL.createObjectURL(blob);

        if (isMounted) setImageUrl(objectUrl);

      } catch (err) {
        console.error('Thumbnail error:',err);

        if (isMounted) setHasError(true);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;

      if (
        objectUrl &&
        objectUrl.startsWith('blob:')
      ) {
        URL.revokeObjectURL(objectUrl);
      }
    };

  }, [file.id]);

  if (hasError || !imageUrl) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-50 flex items-center justify-center">
        <ImageIcon className="w-10 h-10 text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden relative">
      <img
        src={imageUrl}
        alt={file.name}
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}