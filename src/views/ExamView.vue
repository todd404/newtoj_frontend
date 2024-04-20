<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: start;
      width: 100%;
      height: 100%;
      padding: 0 50px;
    "
  >
    <ElSpace style="width: 100%; align-items: center">
      <ElSteps align-center style="width: 70vw" :active="currentProblem">
        <ElStep title="选择题"></ElStep>
        <ElStep title="编程题1"></ElStep>
        <ElStep title="编程题2"></ElStep>
        <ElStep title="编程题3"></ElStep>
      </ElSteps>

      <ElButtonGroup>
        <ElButton
          size="small"
          type="primary"
          :icon="ArrowLeft"
          @click="onProblemMinusClick"
        ></ElButton>
        <ElButton
          size="small"
          type="primary"
          :icon="ArrowRight"
          @click="onProblemPlusClick"
        ></ElButton>
      </ElButtonGroup>

      <ElButton type="primary" @click="submitAlertDialogOpen = true"> 提交 </ElButton>
    </ElSpace>
  </div>

  <ElDialog v-model="submitAlertDialogOpen" title="确认" align-center>
    <span>即使未完成也能提交，分数按完成的内容结算，是否提交？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="submitAlertDialogOpen = false">取消</el-button>
        <el-button type="primary" @click="submitAlertDialogOpen = false"> 确认 </el-button>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import ChoiceProblem from '@/components/exam/ChoiceProblem/ChoiceProblem.vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ref } from 'vue'

const currentProblem = ref(0)
const submitAlertDialogOpen = ref(false)

const onProblemPlusClick = () => {
  if (currentProblem.value >= 4) return

  currentProblem.value++
}

const onProblemMinusClick = () => {
  if (currentProblem.value <= 0) return

  currentProblem.value--
}
</script>

<style scoped></style>
