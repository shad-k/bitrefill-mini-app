'use client'
import { useFormContext } from 'react-hook-form'

export function SubmitButton() {
  const { formState: { isSubmitting } } = useFormContext()

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="bg-violet-600 text-white px-5 py-2 rounded-md hover:bg-violet-700 transition"
    >
      {isSubmitting ? 'Creating...' : 'Create Drop'}
    </button>
  )
}
