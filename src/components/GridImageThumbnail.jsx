import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { API_BASE } from '../utils/constants';

export default function GridImageThumbnail({ file, authToken }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let objectUrl = null;

    const fetchImage = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/preview/${file.id}?size=thumb`, {
          headers: { 'X-API-Key': authToken },
        });
        if (!res.ok) throw new Error('Failed to load image');
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        if (isMounted) setImageUrl(objectUrl);
      } catch (err) {
        if (isMounted) setHasError(true);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file.id, authToken]);

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
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}