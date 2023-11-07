import { random } from 'lodash'

const getPositions = (image: any) => {
  return {
    topLeft: { x: image.x, y: image.y },
    topRight: { x: image.x + image.width, y: image.y },
    bottomLeft: { x: image.x, y: image.y + image.height },
    bottomRight: { x: image.x + image.width, y: image.y + image.height },
    middle: { x: image.x + Math.floor(image.width / 2), y: image.y + Math.floor(image.height / 2) },
  }
}

export const getRandomImagePosition = async (url: any, canvasWidth: any, canvasHeight: any, offsetY: any) => {
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

export const imageHitsCorner = (image: any, canvasWidth: any, canvasHeight: any) => {
  const cornerY = 0
  const cornerX = 0

  return Object.values(image).some((corner: any) => {
    return (corner.x < cornerX && corner.y < cornerY) || // topLeft
      (corner.x > (canvasWidth - cornerX) && corner.y < cornerY) || // topRight
      (corner.x < cornerX && corner.y > (canvasHeight - cornerY)) || // bottomLeft
      (corner.x > (canvasWidth - cornerX) && corner.y < (canvasHeight - cornerY)) // bottomRight
  })
}

export const imageHitsPlacedImages = (image: any, placedImages: any) => {
  const imageCorners = getPositions(image)

  return placedImages.some((placedImage: any) => {
    const placedImageCorners = getPositions(placedImage)

    return imagesOverlap(imageCorners, placedImageCorners)
  })
}

const imagesOverlap = (image1Corners: any, image2Corners: any) => {
  const offset = 0

  const image1Overlaps = Object.entries(image1Corners).some(([key, corner]: any) => {
    return corner.x > (image2Corners.topLeft.x - offset) &&
      corner.y > (image2Corners.topLeft.y - offset) &&
      corner.y < (image2Corners.bottomRight.y + offset) &&
      corner.x < (image2Corners.bottomRight.x + offset);
  })

  const image2Overlaps = Object.entries(image2Corners).some(([key, corner]: any) => {
    return corner.x > (image1Corners.topLeft.x - offset) &&
      corner.y > (image1Corners.topLeft.y - offset) &&
      corner.y < (image1Corners.bottomRight.y + offset) &&
      corner.x < (image1Corners.bottomRight.x + offset);
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
