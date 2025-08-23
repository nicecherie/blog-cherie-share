'use client'
interface SaveButtonProps {
  isSaving: boolean
}
export const SaveButton = ({ isSaving }: SaveButtonProps) => {
  return (
    <button
      type="submit"
      className="fixed bottom-6 right-6 z-50 px-8 py-4 rounded-full hover:bg-primary bg-ring text-white text-lg font-bold shadow-lg transition-colors disabled:opacity-60"
    >
      {isSaving ? '保存中...' : '保存'}
    </button>
  )
}
