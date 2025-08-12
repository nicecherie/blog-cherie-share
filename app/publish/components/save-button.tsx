'use client'
interface SaveButtonProps {
  isSaving: boolean
}
export const SaveButton = ({ isSaving }: SaveButtonProps) => {
  return (
    <button
      type="submit"
      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
    >
      {isSaving ? '保存中...' : '保存'}
    </button>
  )
}
