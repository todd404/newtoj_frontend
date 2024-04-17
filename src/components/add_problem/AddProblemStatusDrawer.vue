<template>
  <ElDrawer v-model="open" :with-header="false">
    <ElSpace direction="vertical" style="width: 100%">
      <div style="width: 200px; height: 200px">
        <template v-if="statusData.statusCode < 200">
          <el-icon :size="200" color="#126bae" class="is-loading"> <Loading /> </el-icon>
        </template>
        <template v-if="statusData.statusCode == 200">
          <el-icon :size="200" color="#12aa9c"> <Check /> </el-icon>
        </template>
        <template v-if="statusData.statusCode > 200">
          <el-icon :size="200" color="#c04851"> <CircleClose /> </el-icon>
        </template>
      </div>
      <ElCard style="width: 20vw" shadow="hover">
        <template v-if="statusData.statusCode < 200">
          <ElText type="primary"> 运行中 </ElText>
        </template>
        <template v-if="statusData.statusCode == 200">
          <ElText type="success"> 添加问题成功 </ElText>
        </template>
        <template v-if="statusData.statusCode > 200">
          <ElText type="danger">
            {{ statusData.msg }}
          </ElText>
        </template>
      </ElCard>
    </ElSpace>
  </ElDrawer>
</template>

<script setup lang="ts">
import { queryAddProblemStatus, type RunReport } from '@/functions/AddProblemFunctions'
import { ref, watch } from 'vue'

const open = defineModel<boolean>({ required: true })
const statusData = ref<RunReport>({
  statusCode: 100,
  msg: ''
})
const props = defineProps<{
  uuid: string
}>()

const refershStatus = async (uuid: string) => {
  statusData.value = await queryAddProblemStatus(uuid)
  if (statusData.value.statusCode < 200) {
    setTimeout(() => {
      refershStatus(uuid)
    }, 1000)
  }
}

watch(
  () => props.uuid,
  (newUUID) => {
    refershStatus(newUUID)
  }
)
</script>

<style scoped></style>
