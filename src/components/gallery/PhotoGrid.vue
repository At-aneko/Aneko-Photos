<template>
  <section ref="gridRef" class="gallery-grid" aria-label="Photo gallery">
    <PhotoCard
      v-for="(photo, index) in photos"
      :key="photo.id || photo.images[0]?.img || index"
      :photo="photo"
      :loaded="loadedImages[index]"
      :priority="index < 6"
      @loaded="$emit('imageLoaded', index)"
      @open="$emit('openPhoto', photo)"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PhotoCard from '@/components/gallery/PhotoCard.vue'
import type { Photo } from '@/features/gallery/types'

defineProps<{
  photos: Photo[]
  loadedImages: boolean[]
}>()

defineEmits<{
  imageLoaded: [index: number]
  openPhoto: [photo: Photo]
}>()

const gridRef = ref<HTMLElement | null>(null)

defineExpose({
  gridRef,
})
</script>

<style scoped>
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-auto-rows: 1px;
  gap: 0;
  padding: 20px;
}

@media screen and (max-width: 900px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
    padding: 16px;
  }
}

@media screen and (max-width: 600px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 10px;
  }
}

@media screen and (max-width: 380px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
