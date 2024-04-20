import type { ChoiceProblem } from '@/components/exam/ChoiceProblem/ChoiceProblem.vue'
import axios from 'axios'
import type { ResponseResult } from './ResponseResult'
import { showErrorMessge, showSuccessMessge } from './utils'

export interface AddChoiceProblemRequest {
  title: string
  choiceProblemList: ChoiceProblem[]
}

export async function addChoiceProblem(addChoiceProblemRequest: AddChoiceProblemRequest) {
  const res = await axios.post(`/api/add-choice-problem`, addChoiceProblemRequest)
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('添加单选题集失败')
  } else {
    showSuccessMessge('添加单选题集成功')
  }
}
