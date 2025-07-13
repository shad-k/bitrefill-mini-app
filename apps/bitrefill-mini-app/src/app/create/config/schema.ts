import * as yup from 'yup';
import { EligibilityCriteria } from './types';

// TODO: fix type here
export const createDropSchema: any = yup.object({
  giftCard: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .required('Gift card is required'),
  amount: yup
    .number()
    .required('Amount is required')
    .typeError('Amount must be a number')
    .positive('Amount must be greater than 0'),
  package: yup.string().when('amount', {
    is: 1,
    then: () => yup.string().required('Package is required'),
    otherwise: () => yup.string().notRequired().optional().nullable(),
  }),
  quantity: yup
    .number()
    .typeError('Quantity must be a number')
    .integer('Quantity must be an integer')
    .positive('Quantity must be greater than 0')
    .required('Quantity is required'),
  deadline: yup.date().required('Deadline is required'),
  criteria: yup
    .mixed<EligibilityCriteria>()
    .oneOf([EligibilityCriteria.REACTION, EligibilityCriteria.REPLY])
    .required('Criteria is required'),
});

export type CreateDropFormValues = yup.InferType<typeof createDropSchema>;
