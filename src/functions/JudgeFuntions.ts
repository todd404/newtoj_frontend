import axios from 'axios'
import type { ResponseResult } from './ResponseResult'

interface JudgeConfig {
  problemId: string | any
  language: string
  code: string
}

interface JudgeResponse extends ResponseResult {
  data: {
    uuid: string
  }
}

export interface JudgeStatus extends ResponseResult {
  data: {
    code: number
    msg: string
  }
}

export async function submitJudge(judgeConfig: JudgeConfig): Promise<JudgeResponse> {
  const res = await axios.post(`/api/judge`, judgeConfig)
  return res.data
}

export async function getStatus(uuid: string): Promise<JudgeStatus> {
  const res = await axios.post(`/api/judge_status`, { uuid })
  return res.data
}
