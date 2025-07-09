'use client'
import DatePicker from 'react-datepicker'
import { useFormContext, Controller } from 'react-hook-form'
import 'react-datepicker/dist/react-datepicker.css'

export function DropFormFields() {
  const { register, formState: { errors }, control } = useFormContext()

  return (
    <>
      <div>
        <label className="block font-medium mb-1">Amount (in ₹)</label>
        <input
          type="number"
          {...register('amount')}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        {typeof errors.amount?.message === 'string' && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Number of Gift Cards</label>
        <input
          type="number"
          {...register('quantity')}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        {typeof errors.quantity?.message === 'string' && (
          <p className="text-sm text-red-500">{errors.quantity.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Deadline</label>
        <Controller
          name="deadline"
          control={control}
          render={({ field }) => (
            <DatePicker
              selected={field.value ? new Date(field.value) : null}
              onChange={date => field.onChange(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholderText="Select a deadline"
            />
          )}
        />
        {typeof errors.deadline?.message === 'string' && (
          <p className="text-sm text-red-500">{errors.deadline.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Eligibility Criteria</label>
        <select
          {...register('criteria')}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="reaction">Reaction</option>
          <option value="reply">Reply</option>
        </select>
      </div>
    </>
  )
}
