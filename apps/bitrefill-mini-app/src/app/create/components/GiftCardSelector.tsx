'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import AsyncSelect from 'react-select/async';

type GiftCardApiItem = {
  id: string;
  name: string;
};

export function GiftCardSelector() {
  const { control } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);

  const [defaultOptions, setDefaultOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const fetchedDefault = useRef(false);

  const fetchDefaultOptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products/');
      if (!res.ok) return;
      const { products }: { products: GiftCardApiItem[] } = await res.json();
      setDefaultOptions(
        products.map((item) => ({ label: item.name, value: item.id }))
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!fetchedDefault.current) {
      fetchDefaultOptions();
      fetchedDefault.current = true;
    }
  }, [fetchDefaultOptions]);

  // 🔁 Debounce logic
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const loadGiftCards = useCallback(
    (inputValue: string): Promise<{ label: string; value: string }[]> => {
      return new Promise((resolve) => {
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(async () => {
          try {
            const res = await fetch(
              `/api/products/search?q=${encodeURIComponent(inputValue)}`
            );
            if (!res.ok) {
              resolve([]);
              return;
            }
            const data: GiftCardApiItem[] = await res.json();
            const options = data.map((item) => ({
              label: item.name,
              value: item.id,
            }));
            resolve(options);
          } catch (error) {
            resolve([]);
          }
        }, 300); // 300ms debounce
      });
    },
    []
  );

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
            defaultOptions={defaultOptions}
            loadOptions={loadGiftCards}
            placeholder="Search gift cards..."
            classNames={{
              control: () => 'border border-gray-300 rounded-md',
            }}
            isLoading={isLoading}
            onChange={(option) => field.onChange(option)}
            value={field.value}
          />
        )}
      />
    </div>
  );
}
