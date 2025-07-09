'use client'
import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form'
import AsyncSelect from 'react-select/async'

type GiftCardApiItem = {
  id: string;
  name: string;
};


export function GiftCardSelector() {
  const { control } = useFormContext()
  const [isLoading, setIsLoading] = useState(false);

  async function loadGiftCards(inputValue: string) {
    
    const res = await fetch(`/api/products/search?q=${encodeURIComponent(inputValue)}`)
    if (!res.ok) return []
    const data: GiftCardApiItem[] = await res.json()
    return data.map((item) => ({ label: item.name, value: item.id }))
  }

  return (
    <div>
      <label className="block font-medium mb-1">Gift Card</label>
      <Controller
        name="giftCard"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <AsyncSelect
            {...field}
            cacheOptions
            defaultOptions
            loadOptions={loadGiftCards}
            placeholder="Search gift cards..."
            classNames={{
              control: () => 'border border-gray-300 rounded-md',
            }}
            isLoading={isLoading}
            onChange={option => field.onChange(option)}
            value={field.value}
          />
        )}
      />
    </div>
  )
}
