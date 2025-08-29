import './code-block-component.scss'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'

interface CodeBlockComponentProps {
  node: {
    attrs: {
      language: string
    }
  }
  updateAttributes: (attrs: any) => void
  extension: any
}

export default ({
  node: {
    attrs: { language: defaultLanguage }
  },
  updateAttributes,
  extension
}: CodeBlockComponentProps) => (
  <NodeViewWrapper className="code-block">
    <select
      contentEditable={false}
      defaultValue={defaultLanguage}
      onChange={(event) => updateAttributes({ language: event.target.value })}
    >
      {/* <option value="null">auto</option> */}
      <option disabled>—</option>
      {extension.options.lowlight
        .listLanguages()
        .map((lang: string, index: number) => (
          <option key={index} value={lang}>
            {lang}
          </option>
        ))}
    </select>
    <pre>
      <NodeViewContent as={'code' as any} />
    </pre>
  </NodeViewWrapper>
)
