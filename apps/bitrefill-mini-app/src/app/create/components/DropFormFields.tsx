'use client';
import DatePicker from 'react-datepicker';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useMemo, useState } from 'react';
import { Package } from '../config/types';

export function DropFormFields() {
  const {
    register,
    formState: { errors },
    control,
    resetField,
  } = useFormContext();
  const selectedGiftCard = useWatch({ name: 'giftCard' });
  const packages = JSON.parse(selectedGiftCard.packages ?? null);
  const range = JSON.parse(selectedGiftCard.range ?? null);

  const hasPackages = Array.isArray(packages) && packages.length > 0;
  const hasRange =
    range && typeof range.min === 'number' && typeof range.max === 'number';

  const [mode, setMode] = useState<'packages' | 'range'>(
    hasPackages ? 'packages' : 'range'
  );

  useEffect(() => {
    resetField('amount');
    resetField('quantity');
    resetField('deadline');
    resetField('criteria');
    const packages = JSON.parse(selectedGiftCard.packages ?? null);

    const hasPackages = Array.isArray(packages) && packages.length > 0;
    setMode(hasPackages ? 'packages' : 'range');
  }, [selectedGiftCard, resetField]);

  const fixedAmountOptions: Array<{ label: string; value: string }> =
    useMemo(() => {
      return (
        packages?.map((pkg: Package) => ({
          label: pkg.value,
          value: pkg.id,
        })) || []
      );
    }, [packages]);

  const filterPassedTime = (time: Date) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  return (
    <>
      <div>
        <label className="block font-medium mb-1">
          Amount{' '}
          {selectedGiftCard?.currency
            ? `(in ${selectedGiftCard?.currency})`
            : ''}
        </label>
        {hasPackages && hasRange && (
          <div className="mb-2">
            <button
              type="button"
              className={`px-3 py-1 rounded-l-md border ${
                mode === 'packages' ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
              onClick={() => {
                resetField('amount');
                setMode('packages');
              }}
            >
              Fixed
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded-r-md border ${
                mode === 'range' ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
              onClick={() => {
                resetField('package');
                setMode('range');
              }}
            >
              Custom
            </button>
          </div>
        )}

        {hasPackages && mode === 'packages' && (
          <select
            {...register('package', { required: 'Amount is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select amount</option>
            {fixedAmountOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        {hasRange && mode === 'range' && (
          <input
            type="number"
            step={range?.step ?? 1}
            min={range?.min}
            max={range?.max}
            {...register('amount', {
              required: 'Amount is required',
              min: {
                value: range.min,
                message: `Minimum allowed amount is ₹${range.min}`,
              },
              max: {
                value: range.max,
                message: `Maximum allowed amount is ₹${range.max}`,
              },
              validate: (value) => {
                const step = range.step ?? 1;
                const parsed = parseFloat(value);
                const inRange = parsed >= range.min && parsed <= range.max;
                const stepValid = Math.abs((parsed - range.min) % step) < 1e-8;
                if (!inRange)
                  return `Amount must be between ₹${range.min} and ₹${range.max}`;
                if (!stepValid) return `Amount must be in steps of ${step}`;
                return true;
              },
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        )}
        {!hasPackages && !hasRange && (
          <input
            type="number"
            {...register('amount')}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        )}
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
              minDate={new Date()}
              filterTime={filterPassedTime}
              selected={field.value ? new Date(field.value) : null}
              onChange={(date) => field.onChange(date)}
              dateFormat="dd-MM-YYYY h:mm aa"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholderText="Select a deadline"
              showTimeSelect={true}
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
  );
}
