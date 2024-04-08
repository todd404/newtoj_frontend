import axios from 'axios'

export async function getAllComments(problemId: string) {
  const res = await axios.get(`/api/comments?problem_id=${problemId}`)
  const body = res.data

  return body.data
}

export interface NewComment {
  problemId: string
  uid: string | number
  parentId: string | null
  content: string
}

export async function submitComment(newComment: NewComment) {
  const res = await axios.post(`/api/submit_comment`, newComment)
  const body = res.data
  return body.data
}

export async function likeComment(id: string) {
  const res = await axios.post(`/api/like_comment`, { id })
  const body = res.data
  return body.code
}
