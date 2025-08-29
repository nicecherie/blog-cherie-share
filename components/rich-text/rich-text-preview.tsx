'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect, useState } from 'react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import 'highlight.js/styles/github-dark.css'
import '@/styles/custom-tiptap.scss'

import { all, createLowlight } from 'lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { BookOpen, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'

const lowlight = createLowlight(all)
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

// ✅ 提取标题 + 生成唯一 id
function extractHeadings(html: string) {
  const div = document.createElement('div')
  div.innerHTML = html

  const usedIds = new Set<string>()
  const headings = Array.from(div.querySelectorAll('h1, h2, h3'))

  return headings.map((h) => {
    let baseId =
      h.textContent
        ?.trim()
        .toLowerCase()
        // 保留中文，去掉多余符号，替换为空格
        .replace(/[^\w\u4e00-\u9fa5-]+/g, '-') || 'heading'

    if (/^\d/.test(baseId)) baseId = `h-${baseId}`

    baseId = baseId.replace(/^-+|-+$/g, '') // 去掉开头/结尾的 "-"

    let uniqueId = baseId
    let counter = 1
    while (usedIds.has(uniqueId)) {
      uniqueId = `${baseId}-${counter++}`
    }
    usedIds.add(uniqueId)

    return {
      id: uniqueId,
      text: h.textContent || '',
      level: Number(h.tagName.replace('H', ''))
    }
  })
}

export default function RichTextPreview(post: Post) {
  const { content, title, created_at, updated_at, author_name } = post
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([])
  const [activeId, setActiveId] = useState<string>('')
  const [open, setOpen] = useState(false) // ✅ 控制移动端目录抽屉

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, CodeBlockLowlight.configure({ lowlight })],
    content,
    editable: false
  })

  // ✅ 生成目录 & 给标题加 id
  useEffect(() => {
    if (!editor) return
    const html = editor.getHTML()
    if (html) {
      const toc = extractHeadings(html)
      setHeadings(toc)

      requestAnimationFrame(() => {
        toc.forEach((h) => {
          const nodeList = document.querySelectorAll(`.tiptap h${h.level}`)
          nodeList.forEach((el) => {
            if (
              el.textContent?.trim() === h.text.trim() &&
              !el.getAttribute('id')
            ) {
              el.setAttribute('id', h.id)
            }
          })
        })
      })
    }
  }, [editor, content])

  // ✅ 监听滚动高亮
  useEffect(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    )

    headings.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  // ✅ 页面刷新时根据 URL 的 #hash 自动定位
  useEffect(() => {
    if (!headings.length) return
    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (hash) {
      const el = document.getElementById(hash)
      if (el) {
        // 初次加载不要动画，避免跳动
        el.scrollIntoView({ behavior: 'auto', block: 'start' })
        setActiveId(hash)
      }
    }
  }, [headings])

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.replaceState(null, '', `#${encodeURIComponent(id)}`)
      setActiveId(id)
      setOpen(false) // ✅ 移动端点击后关闭目录
    }
  }

  return (
    <div className="flex my-5">
      {/* 桌面端目录 */}
      <aside className="w-64 shrink-0 h-fit sticky top-28 overflow-y-auto p-4 hidden md:block">
        <h2 className="font-bold mb-3">目录</h2>
        <ul className="space-y-1 text-sm">
          {headings.map((h) => (
            <li key={h.id} style={{ marginLeft: (h.level - 1) * 12 }}>
              <a
                href={`#${h.id}`}
                onClick={(e) => handleClick(e, h.id)}
                className={`relative block px-2 py-1 rounded transition ${
                  activeId === h.id
                    ? 'text-primary font-bold bg-primary/10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary'
                    : 'hover:text-primary/85 hover:bg-primary/10'
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* 正文 */}
      <main className="prose flex-1 overflow-y-auto p-8 tiptap bg-white/10 dark:bg-gray-900 border border-primary/30 rounded-lg shadow-md">
        <article className="prose max-w-none">
          <header>
            <h1 className="text-2xl font-bold text-center">{title}</h1>
            <div className="text-center">
              <span className="text-sm text-gray-500">{author_name}</span>
              <span className="text-sm text-gray-500">
                {' '}
                发布于 {formatDate(created_at)}{' '}
                {updated_at && updated_at !== created_at && (
                  <span className="text-sm text-gray-500">
                    更新于 {formatDate(updated_at)}
                  </span>
                )}
              </span>
            </div>
          </header>
          <EditorContent editor={editor} />
        </article>
      </main>

      {/* 移动端目录按钮 */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-6 z-50 w-12 h-12 rounded-full 
                   bg-white/50 dark:bg-gray-800/30 backdrop-blur-md border border-white/20
                   flex items-center justify-center shadow-lg md:hidden"
      >
        <BookOpen className="w-6 h-6 text-gray-700 dark:text-gray-200" />
      </motion.button>

      {/* 移动端目录抽屉 */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: open ? 1 : 0, x: open ? 0 : 100 }}
            transition={{ duration: 0.3 }}
            className="
    fixed bottom-40 right-6 z-50
    w-64 max-h-[70vh] overflow-y-auto
    p-4 rounded-2xl shadow-xl
    bg-white/70 dark:bg-gray-900/30
    backdrop-blur-lg border border-white/20
  "
          >
            <h2 className="font-bold mb-3 text-gray-800 dark:text-gray-200">
              📑 目录
            </h2>
            <ul className="space-y-1 text-sm">
              {headings.map((h) => (
                <li key={h.id} style={{ marginLeft: (h.level - 1) * 12 }}>
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => handleClick(e, h.id)}
                    className={`relative block px-2 py-1 rounded transition ${
                      activeId === h.id
                        ? 'text-primary font-bold bg-primary/20'
                        : 'hover:text-primary/85 hover:bg-primary/30'
                    }`}
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
