export enum EligibilityCriteria {
  REACTION = 'reaction',
  REPLY = 'reply',
}

export type CreateDropFormValues = {
  giftCard: { label: string; value: string }
  amount: number
  quantity: number
  deadline: Date
  criteria: EligibilityCriteria
}
