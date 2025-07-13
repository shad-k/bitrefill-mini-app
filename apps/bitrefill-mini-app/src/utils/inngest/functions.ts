import { inngest } from '.';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'drop/hello.world' },
  async ({ event, step }) => {
    await step.sleep('wait-a-moment', '1s');
    return { message: `Hello ${event.data.email}!` };
  }
);

export const callRevealWinners = inngest.createFunction(
  { id: 'reveal-winners' },
  { event: 'drop/reveal.winners' },
  async ({ event, step }) => {
    const dateTime = event.data.dateTime;
    const dropId = event.data.dropId;
    await step.sleepUntil('deadline', dateTime);
    const response = await step.fetch(
      `https://${process.env.APP_URL}/api/drop/${dropId}/reveal-winners`,
      {
        method: 'POST',
      }
    );

    return response;
  }
);
