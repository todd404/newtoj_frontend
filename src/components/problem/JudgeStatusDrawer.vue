<template>
  <ElDrawer v-model="open" :with-header="false">
    <ElSpace direction="vertical" style="width: 100%">
      <div style="width: 200px; height: 200px">
        <template v-if="statusData.data.code < 200">
          <el-icon :size="200" color="#126bae" class="is-loading"> <Loading /> </el-icon>
        </template>
        <template v-if="statusData.data.code == 200">
          <el-icon :size="200" color="#12aa9c"> <Check /> </el-icon>
        </template>
        <template v-if="statusData.data.code > 200">
          <el-icon :size="200" color="#c04851"> <CircleClose /> </el-icon>
        </template>
      </div>
      <ElCard style="width: 20vw" shadow="hover">
        <template v-if="statusData.data.code < 200">
          <ElText type="primary"> 运行中 </ElText>
        </template>
        <template v-if="statusData.data.code == 200">
          <ElText type="success"> 判题成功 </ElText>
        </template>
        <template v-if="statusData.data.code > 200">
          <TypographyParagraph type="danger">
            <pre>{{ statusData.data.msg }}</pre>
          </TypographyParagraph>
        </template>
      </ElCard>
    </ElSpace>
  </ElDrawer>
</template>

<script setup lang="ts">
import { getStatus, type JudgeStatus } from '@/functions/JudgeFuntions'
import { Check, CircleClose, Loading } from '@element-plus/icons-vue'
import { message } from 'ant-design-vue'
import { TypographyParagraph } from 'ant-design-vue'
import { reactive, watch } from 'vue'

const open = defineModel<boolean>()
const statusData: JudgeStatus = reactive({
  code: 0,
  msg: '',
  data: {
    code: 0,
    msg: ''
  }
})

const props = defineProps<{
  uuid: string
}>()

const refreshStatusProcess = async (uuid: string) => {
  const body: JudgeStatus = await getStatus(uuid)
  if (body.code != 200) {
    if (body.msg != null) {
      message.error(body.msg)
    } else {
      message.error('查询状态失败: 未知错误')
    }

    return
  }

  Object.assign(statusData, body)
  if (body.data.code < 200) {
    setTimeout(() => {
      refreshStatusProcess(uuid)
    }, 1000)
  }
}

watch(
  () => props.uuid,
  (newUUID) => {
    refreshStatusProcess(newUUID)
  }
)
</script>

<style scoped></style>
