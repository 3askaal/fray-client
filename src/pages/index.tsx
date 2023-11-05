import { useEffect, useRef, useState } from 'react';
import { useAsyncEffect } from 'rooks';
import sequential from 'promise-sequential';
const md = require('markdown-it')();
import { Hero, Section } from '../components';
import { getRandomImagePosition, imageHitsPlacedImages } from '@/helpers';
import { useApi } from '@/hooks/useApi';

export const Home = () => {
  const { get, BASE_URL } = useApi();
  const [videos, setVideos] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const bodyRef: any = useRef()

  const previewImage = (index: number) => {
    setSelectedImageIndex(index);
  }

  const clearPreviewImage = () => {
    setSelectedImageIndex(null);
  }

  useAsyncEffect(async () => {
    const data: any = get('home-page');

    const newVideos = data.hero.data.map(({ url }: any) => url)
    setVideos(newVideos);

    let imageUrls = data.gallery?.data?.map(({ formats }: any) => {
      return {
        smallUrl: formats?.small?.url || '',
        largeUrl: formats?.large?.url || ''
      }
    }) || [];


    const newSections: any = data.content ? (await Promise.all(data.content.split('___').map(async (content: any) => {
      if (content?.includes('[gallery]')) {
        const { images, galleryHeight } = await createGallery(imageUrls, this.$breakpoints.current)

        return {
          gallery: true,
          images: images.filter((image) => image !== null),
          height: galleryHeight
        }
      }

      return md.render(content || '')
    }))) : [];

    setSections(newSections)
  }, [])

  const createGallery = async (imageUrls: any) => {
    let galleryWidth = Math.round(bodyRef.current.getBoundingClientRect().width)
    let galleryHeight = 500
    let offsetY = 0

    const placedImages: any = []

    // position each image in sequence
    const images = await sequential(imageUrls.map(({ smallUrl, largeUrl }: any) => async () => {
      // assign random image position
      let image = await getRandomImagePosition(smallUrl, galleryWidth, galleryHeight, offsetY)

      let tries = 0;
      const maxTries = 50

      // while image hits a previously placed image
      while (imageHitsPlacedImages(image, placedImages)) {

        // reassign random image position
        image = await getRandomImagePosition(smallUrl, galleryWidth, galleryHeight, offsetY)

        // increment amount tries
        tries++

        // if placing image keeps failing, increase gallery height and reset tries
        if (tries === maxTries) {
          offsetY = galleryHeight
          galleryHeight += image.height * 1.25
          tries = 0
        }
      }

      placedImages.push(image)

      return {
        smallUrl,
        largeUrl,
        style: {
          position: 'absolute',
          maxWidth: image.width + 'px',
          maxHeight: image.height + 'px',
          left: image.x + 'px',
          top: image.y + 'px',
          transform: `rotate(${image.rotate}deg)`,
        }
      }
    }))

    return {
      images,
      galleryHeight
    }
  }

  return (
    <div className="page">
      { !!videos.length && <Hero videos={videos} /> }
      <div className="wrapper">
        <div ref={bodyRef}>
          { sections.map((section: any, index: number) => (
            <Section key={index} className={section.type}>
              { section.gallery ? (
                <div
                  className={`gallery ${selectedImageIndex !== null ? 'gallery--selected' : ''}`}
                  style={{ height: `${section.height}px` }}
                >
                  <div className="gallery__backdrop" onClick={() => clearPreviewImage()} />
                  { section.images.map((image: any, imageIndex: number) => (
                    <div
                      key={`image-${index}`}
                      className={`gallery__item ${selectedImageIndex === index ? 'gallery__item--selected' : ''}`}
                      style={image.style}
                      onClick={() => previewImage(imageIndex)}
                    >
                      <img src={`gallery__item__image ${BASE_URL + (selectedImageIndex === index ? image.largeUrl : image.smallUrl)}`} />
                    </div>
                  )) }
                </div>
              ) : (
                <div className="container--text container--center body body--center spacer">
                  { section }
                </div>
              )}
            </Section>
          )) }
        </div>
      </div>
    </div>
  )
}
