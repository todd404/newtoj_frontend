import axios from 'axios'
import type { ResponseResult } from './ResponseResult'

export const typeReg: { [key: string]: RegExp } = {
  int: /^-?\d+$/,
  'int[]': /^\[(-?\d)+(?:,\s*-?\d+)*\]$|\[\]/
}

export const supportType: string[] = ['int', 'int[]', 'int[][]', 'string', 'string[]']

export interface AddProblemConfig {
  title: string
  content: string
  code: string
  language: string
  problemConfig: ProblemConfig
  problemCaseConfig: ProblemCaseConfig
  problemTags: string[]
}

export interface ProblemConfig {
  functionName: string
  returnType: string
  argumentTypeList: string[]
  argumentNameList: string[]
  timeLimit: number
  memoryLimit: number
  scoreConfig: ScoreConfig
}

export interface ScoreConfig {
  basicCasesCount: number
  basicCasesScore: number
  specialCasesScoreList: number[]
}

export interface ProblemCaseConfig {
  caseUploadedFile: string
  autoCaseCount: number
  perArgAutoCaseConfigList: PerArgAutoCaseConfig[]
  specialCase: string
}

export interface PerArgAutoCaseConfig {
  twoDimArrayItemMin: number
  twoDimArrayItemMax: number
  arrayItemNumMax: number
  arrayItemNumMin: number
  itemMin: number
  itemMax: number
}

export async function addProblem(addProblemConfig: AddProblemConfig): Promise<ResponseResult> {
  const res = await axios.post(`/api/add-problem`, addProblemConfig)
  const data = res.data
  return data
}

export interface RunReport {
  statusCode: number
  msg: string
}

export async function queryAddProblemStatus(uuid: string): Promise<RunReport> {
  const res = await axios.get(`/api/query-add-problem-status`, { params: { uuid } })
  const body: ResponseResult = res.data
  return body.data
}
