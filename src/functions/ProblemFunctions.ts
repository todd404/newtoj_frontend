import axios from 'axios'
import type { ProblemConfig } from './AddProblemFunctions'
import type { ResponseResult } from './ResponseResult'

export interface Problem {
  id: string
  title: string
  content: string
  problemConfig: ProblemConfig
}

export async function getProblem(problemId: string): Promise<Problem> {
  const res = await axios.get(`/api/problem`, { params: { problemId } })
  const data: ResponseResult = res.data
  return data.data
}
