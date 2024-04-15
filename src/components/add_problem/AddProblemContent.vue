<template>
  <ElSpace direction="vertical" style="width: 100%">
    <ElSpace>
      <span>标题：</span>
      <ElInput style="width: 30em"></ElInput>
    </ElSpace>
    <div id="vditor"></div>
  </ElSpace>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const vditor = ref<Vditor | null>(null)

onMounted(() => {
  vditor.value = new Vditor('vditor', {
    mode: 'sv'
  })
})
</script>

<style scoped>
#vditor {
  width: 70vw !important;
  height: 60vh !important;
}
</style>
