'use client'
import { useEffect, useRef, useState } from 'react'
import { Input } from './ui/input'

interface TagsMultiselectProps {
  options: string[]
  value: string[]
  placeholder?: string
  tagsLoading: boolean
  onTagsChange: (tags: string[]) => void
  onNewTagCreated: (tag: string) => void
}
export default function TagsMultiselect({
  options,
  value,
  placeholder,
  tagsLoading,
  onTagsChange,
  onNewTagCreated
}: TagsMultiselectProps) {
  const [open, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLUListElement>(null)

  // 关闭下拉多选菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleCreateTag = () => {
    const newTag = input.trim()
    if (newTag && !value.includes(newTag)) {
      onTagsChange([...value, newTag])
      if (onNewTagCreated) {
        onNewTagCreated(newTag)
      }
    }
    setInput('')
    setIsOpen(true)
    setTimeout(() => {
      handleInputFocus()
    }, 0)
  }

  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[
        highlightedIndex
      ] as HTMLLIElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex])

  // 过滤可选项
  const filteredOptions = options.filter(
    (tag) =>
      tag.toLowerCase().includes(input.toLowerCase()) && !value.includes(tag)
  )

  const keyHandlers: Record<
    string,
    (e: React.KeyboardEvent<HTMLInputElement>) => void
  > = {
    Enter: (e) => {
      e.preventDefault()
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelectOption(filteredOptions[highlightedIndex])
      } else {
        handleCreateTag()
      }
    },
    ArrowDown: (e) => {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, filteredOptions.length - 1)
      )
    },
    ArrowUp: (e) => {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.max(prev - 1, 0))
    },
    Escape: () => {
      setIsOpen(false)
      setHighlightedIndex(-1)
    },
    Backspace: () => {
      if (input === '' && input.length > 0) {
        onTagsChange(value.slice(0, -1))
      }
    }
  }

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const handler = keyHandlers[event.key]
    if (handler) {
      handler(event)
    }
  }

  const handleInputFocus = () => {
    inputRef.current?.focus()
  }
  const handleSelectOption = (tag: string) => {
    if (!value.includes(tag)) {
      onTagsChange([...value, tag])
    }
    setInput('')
    setIsOpen(true)
    setTimeout(() => {
      handleInputFocus()
    }, 0)
  }
  return (
    <div ref={containerRef} className="relative w-full">
      {/* // 输入框: 点击输入框打开下拉选项*/}
      <div
        className="flex flex-wrap items-center border border-input gap-2 focus-within:ring-2 rounded-md px-3 text-sm"
        onClick={() => setIsOpen(true)}
      >
        {value.map((tag) => (
          <span className="flex items-center gap-1 rounded px-1 my-1 text-white bg-tag-bg ">
            {tag}
            <button
              className="text-white hover:text-sky-200"
              onClick={(e) => {
                e.stopPropagation()
                onTagsChange(value.filter((t) => t !== tag))
              }}
            >
              ×
            </button>
          </span>
        ))}
        <Input
          ref={inputRef}
          className="flex-1 bg-transparent border-none focus-visible:ring-0 outline-none min-w-[80px]"
          value={input}
          id="tags"
          placeholder={placeholder || '请输入类别'}
          type="text"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </div>
      {/* // 下拉选项: 显示所有可选标签 */}
      {open && (
        <ul
          ref={dropdownRef}
          className="absolute z-50 left-0 right-0 bg-card border border-border rounded-b-lg mt-1 max-h-40 overflow-y-auto shadow-lg"
        >
          {tagsLoading ? (
            <span>loading...</span>
          ) : filteredOptions?.length > 0 ? (
            filteredOptions.map((tag, index) => (
              <li
                key={tag}
                className={`px-4 py-2 cursor-pointer hover:bg-tag-bg hover:text-white text-foreground ${
                  index === highlightedIndex ? 'bg-tag-bg text-white' : ''
                }`}
                onClick={() => handleSelectOption(tag)}
              >
                {tag}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-muted-foreground">
              {input.trim() ? '没有匹配的标签' : '没有可用的标签'}，按回车键创建
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
