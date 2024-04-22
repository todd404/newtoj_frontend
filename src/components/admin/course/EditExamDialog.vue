<template>
  <ElDialog v-model="modelValue"></ElDialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({ required: true })
</script>

<style scoped></style>
