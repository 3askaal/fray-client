import { useRef, useState } from 'react';
import Image from 'next/image';
import { useAsyncEffect } from 'rooks';

import style from './Gallery.module.scss';
import classNames from 'classnames';
import { createGallery } from '@/helpers/gallery';

export const Gallery = ({ images }: any) => {
  const galleryRef: any = useRef()
  const [gallery, setGallery]: any = useState({})
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const previewImage = (index: number) => {
    setSelectedImageIndex(index);
  }

  const clearPreviewImage = () => {
    setSelectedImageIndex(null);
  }

  useAsyncEffect(async () => {
    if (!images.length) return;
    if (!galleryRef.current) return;

    const gallery = await createGallery(galleryRef, images)
    setGallery(gallery);
  }, [galleryRef.current])

  return (
    <div
      ref={galleryRef}
      className={classNames([style['gallery'], { [style['gallery--selected']]: selectedImageIndex !== null }])}
      style={{ height: `${gallery.height || 500}px` }}
    >
      <div className={style['gallery__backdrop']} onClick={() => clearPreviewImage()} />
      { gallery.images?.map((image: any, imageIndex: number) => (
        <div
          key={`image-${imageIndex}`}
          className={classNames([style['gallery__item'], { [style['gallery__item--selected']]: selectedImageIndex === imageIndex }])}
          style={image.style}
          onClick={() => previewImage(imageIndex)}
        >
          <Image
            className={style['gallery__item__image']}
            alt={image.smallUrl}
            src={selectedImageIndex === imageIndex ? image.largeUrl : image.smallUrl}
            width={image.width}
            height={image.height}
          />
        </div>
      )) }
    </div>
  )
}
