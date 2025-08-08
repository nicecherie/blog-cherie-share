import { useRef, useState } from 'react'
import { Input } from './ui/input'

interface TagsMultiselectProps {
  options: string[]
  value: string[]
  tagsLoading: boolean
  onTagsChange: (tags: string[]) => void
  onNewTagCreated: (tag: string) => void
}
export default function TagsMultiselect({
  options,
  value,
  tagsLoading,
  onTagsChange,
  onNewTagCreated
}: TagsMultiselectProps) {
  const [open, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleCreateTag = () => {
    const newTag = input.trim()
    if (newTag && !options.includes(newTag)) {
      onTagsChange([...value, newTag])
      if (onNewTagCreated) {
        onNewTagCreated(newTag)
      }
    }
  }

  const keyHandlers: Record<string, (e: KeyboardEvent) => void> = {
    Enter: (e) => {
      e.preventDefault()
      // if () {

      // } else {
      //   handleCreateTag()
      // }
    },
    ArrowDown: (e) => {}
  }

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const handler = keyHandlers[event.key]
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
    <div className="relative">
      {/* // 输入框: 点击输入框打开下拉选项*/}
      <div className="flex" onClick={() => setIsOpen(true)}>
        <Input
          ref={inputRef}
          value={input}
          id="tags"
          placeholder="请输入标签"
          type="text"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </div>
      {/* // 下拉选项: 显示所有可选标签 */}
      {open && (
        <ul>
          {tagsLoading ? (
            <span>loading...</span>
          ) : options?.length > 0 ? (
            options.map((tag) => (
              <li key={tag} onClick={() => handleSelectOption(tag)}>
                {tag}
              </li>
            ))
          ) : (
            <li>
              {input.trim() ? '没有匹配的标签' : '没有可用的标签'}，按回车键创建
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
