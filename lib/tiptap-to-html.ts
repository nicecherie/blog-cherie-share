import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'

// 把 tiptap JSON 转 HTML
export function tiptapToHtml(json: any): string {
  if (!json) return ''
  return generateHTML(json, [StarterKit])
}
