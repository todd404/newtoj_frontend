<template>
  <a-modal
    ref="modalRef"
    v-model:open="open"
    :wrap-style="{ overflow: 'hidden' }"
    @ok="handleOk"
    :z-index="99999"
  >
    <slot></slot>
    <template #title>
      <div ref="modalTitleRef" style="width: 100%; cursor: move">{{ $props.title }}</div>
    </template>
    <template #modalRender="{ originVNode }">
      <div :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import { ref, computed, type CSSProperties, watch, watchEffect } from 'vue'
import { useDraggable } from '@vueuse/core'
const open = defineModel<boolean>('open', { required: true })
const modalTitleRef = ref<HTMLElement>(null)
defineProps<{ title: string }>()
const emit = defineEmits(['ok'])

const { x, y, isDragging } = useDraggable(modalTitleRef)
const handleOk = () => {
  emit('ok')
  open.value = false
}
const startX = ref<number>(0)
const startY = ref<number>(0)
const startedDrag = ref(false)
const transformX = ref(0)
const transformY = ref(0)
const preTransformX = ref(0)
const preTransformY = ref(0)
const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 })
watch([x, y], () => {
  if (!startedDrag.value) {
    startX.value = x.value
    startY.value = y.value
    const bodyRect = document.body.getBoundingClientRect()
    const titleRect = modalTitleRef.value.getBoundingClientRect()
    dragRect.value.right = bodyRect.width - titleRect.width
    dragRect.value.bottom = bodyRect.height - titleRect.height
    preTransformX.value = transformX.value
    preTransformY.value = transformY.value
  }
  startedDrag.value = true
})
watch(isDragging, () => {
  if (!isDragging) {
    startedDrag.value = false
  }
})

watchEffect(() => {
  if (startedDrag.value) {
    transformX.value =
      preTransformX.value +
      Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
      startX.value
    transformY.value =
      preTransformY.value +
      Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
      startY.value
  }
})
const transformStyle = computed<CSSProperties>(() => {
  return {
    transform: `translate(${transformX.value}px, ${transformY.value}px)`
  }
})
</script>
