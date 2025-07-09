import * as yup from 'yup'
import { EligibilityCriteria } from './types'

export const createDropSchema = yup.object({
  giftCard: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .required('Gift card is required'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be greater than 0')
    .required('Amount is required'),
  quantity: yup
    .number()
    .typeError('Quantity must be a number')
    .integer('Quantity must be an integer')
    .positive('Quantity must be greater than 0')
    .required('Quantity is required'),
  deadline: yup
    .date()
    .required('Deadline is required'),
  criteria: yup
    .mixed<EligibilityCriteria>()
    .oneOf([EligibilityCriteria.REACTION, EligibilityCriteria.REPLY])
    .required('Criteria is required'),
})
