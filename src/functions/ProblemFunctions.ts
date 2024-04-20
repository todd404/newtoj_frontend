import axios from 'axios'
import type { ProblemConfig } from './AddProblemFunctions'
import type { ResponseResult } from './ResponseResult'
import { getCppCodeTemplate } from './CodeTemplate'

export interface Problem {
  id: string
  title: string
  content: string
  problemConfig: ProblemConfig
}

interface tamplateFuntion {
  (problem: Problem): string
}

export async function getProblem(problemId: string): Promise<Problem> {
  const res = await axios.get(`/api/problem`, { params: { problemId } })
  const data: ResponseResult = res.data
  return data.data
}

export const getCodeTamplate: { [key: string]: tamplateFuntion } = {
  cpp
}

function cpp(problem: Problem): string {
  return getCppCodeTemplate(problem.problemConfig)
}
