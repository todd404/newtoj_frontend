<template>
  <ElSpace direction="vertical" style="width: 100%">
    <ElSpace>
      <span>标题：</span>
      <ElInput style="width: 30em" v-model="title"></ElInput>
    </ElSpace>
    <div id="vditor"></div>
  </ElSpace>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const vditor = ref<Vditor | null>(null)
const title = defineModel<string>('title', { required: true })
const content = defineModel<string>('content', { required: true })

onMounted(() => {
  vditor.value = new Vditor('vditor', {
    mode: 'sv',
    cache: { enable: false },
    input: (value) => {
      content.value = value
    },
    width: '70vw',
    height: '60vh'
  })
})
</script>

<style scoped></style>
