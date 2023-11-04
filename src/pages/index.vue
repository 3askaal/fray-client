<template>
  <div class="page">
    <Hero v-if="videos.length" :videos="videos" />
    <div class="wrapper">
      <div ref="body">
        <Section v-for="(block, index) in blocks" :key="index" :class="block.type">
          <div
            v-if="block.gallery"
            class="gallery"
            :style="{ height: `${block.height}px` }"
            :class="[selectedImageIndex !== null ? 'gallery--selected' : '']"
          >
            <div class="gallery__backdrop" @click="() => clearPreviewImage()" />
            <div
              v-for="(image, index) in block.images"
              :key="`image-${index}`"
              class="gallery__item"
              :class="[selectedImageIndex === index ? 'gallery__item--selected' : '']"
              :style="image.style"
              @click="() => previewImage(index)"
            >
              <img :src="baseUrl + (selectedImageIndex === index ? image.largeUrl : image.smallUrl)" class="gallery__item__image" />
            </div>
          </div>
          <div v-else v-html="block" class="container--text container--center body body--center spacer" />
        </Section>
      </div>
    </div>
  </div>
</template>

<script>
import { getRandomImagePosition, imageHitsPlacedImages } from '../helpers'
const md = require('markdown-it')();
const sequential = require('promise-sequential');

export default {
  layout: 'home',
  head: {
    title: 'Home',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Fray Handmade - Home'
      }
    ]
  },
  async mounted() {
    const data = await this.$api.get('home-page')

    this.videos = data.hero.data.map(({ url }) => url)
    this.content = data.content

    if (data?.gallery?.data) {
      this.imageUrls = data.gallery.data.map(({ formats }) => {
        return {
          smallUrl: formats?.small?.url || '',
          largeUrl: formats?.large?.url || ''
        }
      })
    }
  },
  data() {
    return {
      content: '',
      videos: [],
      imageUrls: [],
      galleryItemIndex: 0,
      selectedImageIndex: null
    }
  },
  asyncComputed: {
    async blocks() {
      return this.content ? Promise.all(this.content.split('___').map(async (content) => {

        if (content?.includes('[gallery]')) {
          const { images, galleryHeight } = (await this.formatImages(this.imageUrls, this.$breakpoints.current))

          return {
            gallery: true,
            images: images.filter((image) => image !== null),
            height: galleryHeight
          }
        }

        return md.render(content || '')
      })) : []
    }
  },
  methods: {
    async formatImages(imageUrls, bp) {
      let galleryWidth = Math.round(this.$refs.body.getBoundingClientRect().width)
      let galleryHeight = 500
      let offsetY = 0

      const placedImages = []

      // position each image in sequence
      const images = await sequential(imageUrls.map(({ smallUrl, largeUrl }, index) => async () => {
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
    },
    previewImage(index) {
      this.selectedImageIndex = index
    },
    clearPreviewImage() {
      this.selectedImageIndex = null
    }
  }
}
</script>

<style lang="scss">
.page {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.gallery {
  position: relative;
  width: 100%;
  margin-bottom: 200px;
}

.gallery__item--selected {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  max-width: none !important;
  max-height: none !important;
  transform: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3000;
}

.gallery__item__image {
  width: 100%;
  cursor: pointer;

  .gallery__item--selected & {
    width: auto;
    max-width: 80%;
    max-height: 80%;
  }
}

.gallery__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(black, .5);
  opacity: 0;
  transition: all .5s ease;
  z-index: 2000;
  pointer-events: none;

  .gallery--selected & {
    opacity: 1;
    pointer-events: auto;
  }
}

.body__video {
  display: none;
}
</style>
