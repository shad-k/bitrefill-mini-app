'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  type CreateDropFormValues,
  createDropSchema,
} from '@/app/create/config/schema';
import { EligibilityCriteria } from '@/app/create/config/types';
import { GiftCardSelector } from '@/app/create/components/GiftCardSelector';
import { DropFormFields } from '@/app/create/components/DropFormFields';
import { SubmitButton } from '@/app/create/components/SubmitButton';
import { useRouter } from 'next/navigation';
import { useNeynarContext } from '@neynar/react';

export default function CreateDropPage() {
  const { user } = useNeynarContext();
  const router = useRouter();
  const methods = useForm<CreateDropFormValues>({
    resolver: yupResolver(createDropSchema),
    defaultValues: {
      giftCard: { label: '', value: '' },
      quantity: 1,
      amount: 1,
      deadline: new Date(),
      criteria: EligibilityCriteria.REACTION,
    },
  });

  const onSubmit = async (data: CreateDropFormValues) => {
    const res = await fetch('/api/drop/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        giftcard_id: data.giftCard.value,
        giftcard_name: data.giftCard.label,
        amount: data.amount,
        package_id: data.package,
        quantity: data.quantity,
        deadline: data.deadline.toISOString(),
        criteria: data.criteria,
        created_by: user?.fid, // Replace with actual user ID
      }),
    });
    const drop = await res.json();
    console.log('Drop created:', drop);
    if (drop.dropId) {
      router.push(`/drop/${drop.dropId}`);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Create a Drop</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <GiftCardSelector />
          <DropFormFields />
          <SubmitButton />
        </form>
      </FormProvider>
    </main>
  );
}
