import { ElMessage } from 'element-plus'

export function showSuccessMessge(msg: string) {
  ElMessage({
    type: 'success',
    message: msg
  })
}

export function showErrorMessge(msg: string) {
  ElMessage({
    type: 'error',
    message: msg
  })
}
