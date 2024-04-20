import axios from 'axios'
import type { ResponseResult } from './ResponseResult'
import type { RunCase } from '@/components/problem/ProblemRun.vue'
import { showErrorMessge } from './utils'

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

interface RunForResultRequet {
  problemId: string
  language: string
  code: string
  runCase: string
}

export async function runForResult(
  problemId: string,
  language: string,
  code: string,
  runCaseList: RunCase[]
): Promise<string> {
  let runCase = ''
  for (const c of runCaseList) {
    for (const arg of c.runArgList) {
      if (!arg.argValicated) {
        showErrorMessge('有运行用例填写错误')
        return ''
      }
      runCase += `${arg.argContent}\n`
    }
  }
  runCase = runCase.slice(0, -1)

  const request: RunForResultRequet = {
    problemId,
    language,
    code,
    runCase
  }

  const res = await axios.post(`/api/run`, request)
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('运行失败！')
    return ''
  }

  const result = data.data.uuid
  return result
}

export interface RunStatusResponse {
  statusCode: number
  msg: string
  runResult: string
}

export async function getRunStatus(uuid: string) {
  const res = await axios.get(`/api/run-status`, { params: { uuid } })
  const data: ResponseResult = res.data
  const body: RunStatusResponse = data.data
  return body
}
