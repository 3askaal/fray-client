import sequential from "promise-sequential"
import { MutableRefObject } from "react"
import { random } from "lodash"

const getCornerPositions = (image: any) => {
  return {
    topLeft: { x: image.x, y: image.y },
    topRight: { x: image.x + image.width, y: image.y },
    bottomLeft: { x: image.x, y: image.y + image.height },
    bottomRight: { x: image.x + image.width, y: image.y + image.height },
    middle: { x: image.x + Math.floor(image.width / 2), y: image.y + Math.floor(image.height / 2) },
  }
}

export const getRandomPlacement = async (url: any, canvasWidth: any, canvasHeight: any, offsetY: any) => {
  const { width, height } = await getImageDimensions(url)

  const randomIncreaseValue = random(20, 80) / 100
  const randomImageWidth = Math.round(width * randomIncreaseValue)
  const randomImageHeight = Math.round(height * randomIncreaseValue)

  const randomX = random(0, (canvasWidth - randomImageWidth))
  const randomY = random(offsetY, (canvasHeight - randomImageHeight))
  const randomRotate = random(-20, 20)

  return {
    width: randomImageWidth,
    height: randomImageHeight,
    x: randomX,
    y: randomY,
    rotate: randomRotate
  }
}

export const hitsCorner = (image: any, canvasWidth: any, canvasHeight: any) => {
  const cornerY = 0
  const cornerX = 0

  return Object.values(image).some((corner: any) => {
    return (corner.x < cornerX && corner.y < cornerY) || // topLeft
      (corner.x > (canvasWidth - cornerX) && corner.y < cornerY) || // topRight
      (corner.x < cornerX && corner.y > (canvasHeight - cornerY)) || // bottomLeft
      (corner.x > (canvasWidth - cornerX) && corner.y < (canvasHeight - cornerY)) // bottomRight
  })
}

export const hitsPlacedImages = (image: any, placedImages: any, offset?: number) => {
  const imageCorners = getCornerPositions(image)

  return placedImages.some((placedImage: any) => {
    const placedImageCorners = getCornerPositions(placedImage)

    return imagesOverlap(imageCorners, placedImageCorners, offset)
  })
}

const imagesOverlap = (image1Corners: any, image2Corners: any, offset: number = 0) => {
  const image1Overlaps = Object.entries(image1Corners).some(([key, corner]: any) => {
    return corner.x > (image2Corners.topLeft.x + offset) &&
      corner.y > (image2Corners.topLeft.y + offset) &&
      corner.y < (image2Corners.bottomRight.y - offset) &&
      corner.x < (image2Corners.bottomRight.x - offset);
  })

  const image2Overlaps = Object.entries(image2Corners).some(([key, corner]: any) => {
    return corner.x > (image1Corners.topLeft.x + offset) &&
      corner.y > (image1Corners.topLeft.y + offset) &&
      corner.y < (image1Corners.bottomRight.y - offset) &&
      corner.x < (image1Corners.bottomRight.x - offset);
  })

  return image1Overlaps || image2Overlaps
}

export const getImageDimensions = (url: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve({
      width: img.width,
      height: img.height,
    });

    img.onerror = (error) => reject(error);

    img.src = url;
  });
};

export const createGallery = async (ref: MutableRefObject<HTMLElement>, imageUrls: string[]) => {
  let galleryWidth = Math.round(ref.current!.getBoundingClientRect().width)
  let galleryHeight = 500
  let offsetY = 0

  const placedImages: any = []

  // position each image in sequence
  const images = await sequential(imageUrls.map(({ smallUrl, largeUrl }: any) => async () => {

    // assign random image dimensions and position
    let image = await getRandomPlacement(smallUrl, galleryWidth, galleryHeight, offsetY)

    let tries = 0;
    const maxTries = 20

    // while image hits a previously placed image
    while (hitsPlacedImages(image, placedImages, 20)) {

      // reassign random image dimensions and position
      image = await getRandomPlacement(smallUrl, galleryWidth, galleryHeight, offsetY)

      // increment amount tries
      tries++

      // if placing image keeps failing, increase gallery height and reset tries
      if (tries === maxTries) {
        offsetY = galleryHeight
        galleryHeight += image.height * 1.25
        tries = 0
      }
    }

    placedImages.push(image);

    return {
      smallUrl,
      largeUrl,
      width: image.width,
      height: image.height,
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
    height: galleryHeight
  }
}
