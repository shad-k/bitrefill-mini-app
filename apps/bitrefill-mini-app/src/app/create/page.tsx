'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createDropSchema } from '@/app/create/config/schema'
import { EligibilityCriteria, type CreateDropFormValues } from '@/app/create/config/types'
import { GiftCardSelector } from '@/app/create/components/GiftCardSelector'
import { DropFormFields } from '@/app/create/components/DropFormFields'
import { SubmitButton } from '@/app/create/components/SubmitButton'

export default function CreateDropPage() {
  const methods = useForm<CreateDropFormValues>({
    resolver: yupResolver(createDropSchema),
    defaultValues: {
      giftCard: { label: '', value: '' },
      amount: 1,
      quantity: 1,
      deadline: new Date(),
      criteria: EligibilityCriteria.REACTION,
    },
  })

  const onSubmit = (data: CreateDropFormValues) => {
    console.log('Create Drop:', data)
  }

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
  )
}
