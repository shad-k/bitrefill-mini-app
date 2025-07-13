'use client';
import { useProfile } from '@farcaster/auth-kit';
import { useFormContext } from 'react-hook-form';

export function SubmitButton() {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const { isAuthenticated } = useProfile();

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        disabled
        className="bg-gray-400 text-white px-5 py-2 rounded-md cursor-not-allowed"
      >
        Please sign in to create a drop
      </button>
    );
  }

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="bg-violet-600 text-white px-5 py-2 rounded-md hover:bg-violet-700 transition"
    >
      {isSubmitting ? 'Creating...' : 'Create Drop'}
    </button>
  );
}
