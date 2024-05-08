<template>
  <UComment :config="config" page @submit="submit" @like="like">
    <template #info="scope">
      <ElButton size="small" @click="handleWhipserClick(scope)">发私信</ElButton>
    </template>
  </UComment>
  <WhisperDialog
    v-model="whisperDialogOpen"
    :otherId="whisperOtherId"
    :other-nickname="whisperOtherNickName"
  ></WhisperDialog>
</template>

<script setup lang="ts">
import emoji from '@/assets/emoji'
import { getAllComments, likeComment, submitComment } from '@/functions/CommentFunctions'
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge } from '@/functions/utils'
import { useUserInfoStore } from '@/stores/userInfoStore'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { UComment, type ConfigApi, type SubmitParamApi } from 'undraw-ui'
import { onMounted, reactive, ref } from 'vue'
import WhisperDialog from '../WhisperDialog/WhisperDialog.vue'

const userInfoStore = useUserInfoStore()
const whisperOtherId = ref('0')
const whisperOtherNickName = ref('')
const whisperDialogOpen = ref(false)

const props = defineProps<{
  problemId: string
}>()

const config = reactive<ConfigApi>({
  user: {
    id: userInfoStore.getUserInfo.value?.userId ? userInfoStore.getUserInfo.value.userId : 0,
    username: userInfoStore.getUserInfo.value?.nickname
      ? userInfoStore.getUserInfo.value?.nickname
      : '未登录',
    avatar: `http://localhost/file/avatar/${userInfoStore.getUserInfo.value?.userId}.png`,
    likeIds: []
  },
  showAddress: false,
  showLevel: false,
  emoji: emoji,
  comments: []
})

const getLikeList = async () => {
  const res = await axios.get(`/api/like-list`, { params: { problemId: props.problemId } })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取点赞列表失败')
  } else {
    config.user.likeIds = data.data
  }
}

const refreshComments = async () => {
  let comments = await getAllComments(props.problemId)
  config.comments = comments
}

onMounted(() => {
  refreshComments()
  getLikeList()
})

// 提交评论事件
const submit = async ({ content, parentId, files, finish }: SubmitParamApi) => {
  let comment = await submitComment({
    uid: config.user.id,
    problemId: props.problemId,
    parentId,
    content
  })

  finish(comment)
  ElMessage({ type: 'success', message: '评论成功' })
}

// 点赞按钮事件 将评论id返回后端判断是否点赞，然后在处理点赞状态
const like = async (id: string, finish: () => void) => {
  const code = await likeComment(id)
  if (code == 200) {
    finish()
  }
}

const handleWhipserClick = (info: any) => {
  if (info.uid == userInfoStore.getUserInfo.value?.userId) {
    showErrorMessge('不能给自己发私信')
    return
  }

  whisperOtherId.value = info.uid
  whisperOtherNickName.value = info.user.username
  whisperDialogOpen.value = true
}
</script>

<style scoped></style>
