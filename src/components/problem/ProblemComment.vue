<template>
  <UComment :config="config" page @submit="submit" @like="like"></UComment>
</template>

<script setup lang="ts">
import emoji from '@/assets/emoji'
import { getAllComments, likeComment, submitComment } from '@/functions/CommentFunctions'
import { ElMessage } from 'element-plus'
import { UComment, type ConfigApi, type SubmitParamApi } from 'undraw-ui'
import { onMounted, reactive } from 'vue'

const config = reactive<ConfigApi>({
  user: {
    id: 1,
    username: 'jack',
    avatar:
      'https://static.juzicon.com/avatars/avatar-200602130320-HMR2.jpeg?x-oss-process=image/resize,w_100',
    likeIds: [1, 2, 3]
  },
  showAddress: false,
  showLevel: false,
  emoji: emoji,
  comments: []
})

const refreshComments = async () => {
  //TODO: 修改为路由参数的problemId
  let comments = await getAllComments('1')
  config.comments = comments
}

onMounted(() => {
  refreshComments()
})

// 提交评论事件
const submit = async ({ content, parentId, files, finish }: SubmitParamApi) => {
  //TODO: 修改为路由参数的problemId
  let comment = await submitComment({ uid: config.user.id, problemId: '1', parentId, content })

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
</script>

<style scoped></style>
