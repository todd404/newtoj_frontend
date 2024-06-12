import { message } from 'ant-design-vue'

export function showSuccessMessge(msg: string) {
  message.success(msg)
}

export function showErrorMessge(msg: string) {
  message.error(msg)
}
