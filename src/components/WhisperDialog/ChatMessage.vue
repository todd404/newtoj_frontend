<template>
  <div class="chat-message" style="background-color: #eee; display: grid">
    <span :class="classObject"><slot></slot></span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type: 'mine' | 'other'
}>()

const classObject = computed(() => ({
  mine: props.type == 'mine',
  other: props.type == 'other'
}))
</script>

<style scoped>
.chat-message span.other {
  background-color: #fff;
  padding: 5px 8px;
  display: inline-block;
  border-radius: 4px;
  margin: 10px 0 10px 10px;
  justify-self: start;
  max-width: 55%;
  position: relative;
}

.chat-message span.other::after {
  content: '';
  border: 8px solid #ffffff00;
  border-right: 8px solid #fff;
  position: absolute;
  top: 6px;
  left: -16px;
}

.chat-message span.mine {
  color: #000;
  background-color: #86c166;
  padding: 5px 8px;
  display: inline-block;
  border-radius: 4px;
  margin: 10px 10px 10px 10px;
  max-width: 55%;
  justify-self: end;
  position: relative;
}

.chat-message span.mine::after {
  content: '';
  border: 8px solid #ffffff00;
  border-left: 8px solid #86c166;
  position: absolute;
  top: 6px;
  right: -16px;
}
</style>
