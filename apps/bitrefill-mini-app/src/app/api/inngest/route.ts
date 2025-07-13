// src/app/api/inngest/route.ts
import { serve } from 'inngest/next';
import { inngest } from '@/utils/inngest';
import { callRevealWinners } from '@/utils/inngest/functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [callRevealWinners],
});
