<template>
  <splitpanes class="default-theme" style="height: 89vh; padding: 0 30px 0 30px">
    <pane min-size="20" max-size="70">
      <ProblemArea></ProblemArea>
    </pane>
    <pane>
      <Splitpanes class="default-theme" horizontal>
        <Pane size="70">
          <ProblemCodeEditor></ProblemCodeEditor>
        </Pane>
        <Pane></Pane>
      </Splitpanes>
    </pane>
  </splitpanes>
</template>

<script setup lang="ts">
import ProblemArea from '@/components/problem/ProblemArea.vue'
import ProblemCodeEditor from '@/components/problem/ProblemCodeEditor.vue'
import ProblemContent from '@/components/problem/ProblemContent.vue'
import axios from 'axios'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { ref } from 'vue'
</script>

<style scoped></style>
