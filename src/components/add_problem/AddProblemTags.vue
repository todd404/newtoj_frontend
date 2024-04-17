<template>
  <ElSpace direction="vertical" style="align-items: start">
    <ElSpace>
      <ElInput v-model="inputTag"></ElInput>
      <ElButton type="primary" @click="onAddTagButtonClick">添加标签</ElButton>
    </ElSpace>

    <ElSpace>
      <ElTag
        v-for="(tag, index) of tags"
        :key="`tag-${index}`"
        closable
        @close="tags = tags?.filter((v, idx) => idx != index)"
      >
        {{ tag }}
      </ElTag>
    </ElSpace>
  </ElSpace>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tags = defineModel<string[]>('tags', { required: true })
const inputTag = ref('')

const onAddTagButtonClick = () => {
  if (inputTag.value == '') return
  if (tags.value?.length >= 3) return

  tags.value?.push(inputTag.value)
}
</script>

<style scoped></style>
