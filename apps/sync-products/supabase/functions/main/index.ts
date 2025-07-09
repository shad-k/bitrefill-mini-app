import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async () => {
  const BITREFILL_API_KEY = Deno.env.get('BITREFILL_API_KEY');
  const BITREFILL_API_URL = Deno.env.get('BITREFILL_API_URL');
  const PRODUCTS_ENDPOINT = '/products';
  const DB_URL = Deno.env.get('DB_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!BITREFILL_API_KEY || !DB_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response('Missing environment variables', { status: 500 });
  }

  const supabase = createClient(DB_URL, SUPABASE_SERVICE_ROLE_KEY);

  async function waitIfRateLimited(headers: Headers) {
    const rateLimitRemaining = Number(headers.get('X-RateLimit-Remaining'));
    const resetSeconds = Number(headers.get('X-RateLimit-Reset'));

    if (rateLimitRemaining === 0 && !isNaN(resetSeconds)) {
      const waitMs = resetSeconds * 1000;
      console.log(`⏳ Rate limit hit. Waiting ${waitMs}ms before retrying...`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  async function fetchAndPush(
    url: string,
    headers: Record<string, string>
  ): Promise<number> {
    let totalInserted = 0;

    while (url) {
      const res = await fetch(url, { headers });

      if (!res.ok) {
        if (res.status === 429) {
          const resetSeconds = Number(res.headers.get('X-RateLimit-Reset'));
          if (!isNaN(resetSeconds)) {
            const waitMs = resetSeconds * 1000;
            console.log(`⏳ Rate limited. Retrying after ${waitMs}ms...`);
            await new Promise((resolve) => setTimeout(resolve, waitMs));
            continue;
          }
        }

        const err = await res.text();
        throw new Error(`❌ Failed to fetch: ${err}`);
      }

      const { data, meta } = await res.json();
      console.log(`📦 Fetched ${data.length} products from Bitrefill`);

      const giftcards = data
        .filter((p: any) => p.in_stock)
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          country_code: p.country_code ?? null,
          country_name: p.country_name ?? null,
          currency: p.currency,
          image_url: p.image ?? null,
          in_stock: typeof p.in_stock === 'boolean' ? p.in_stock : null,
          packages: p.packages ? JSON.stringify(p.packages) : null,
          range: p.range ? JSON.stringify(p.range) : null,
        }));

      if (giftcards.length > 0) {
        const { error } = await supabase
          .from('giftcards')
          .upsert(giftcards, { onConflict: 'id' });

        if (error) {
          console.error('❌ Supabase insert error:', error);
          throw new Error('❌ Failed to upsert giftcards');
        }

        console.log(`✅ Upserted ${giftcards.length} giftcards`);
        totalInserted += giftcards.length;
      }

      // Handle rate limits before next request
      await waitIfRateLimited(res.headers);

      url =
        meta && meta._next ? `${meta._next}&include_test_products=true` : '';
    }

    return totalInserted;
  }

  try {
    const initialUrl = `${BITREFILL_API_URL}${PRODUCTS_ENDPOINT}?include_test_products=true`;
    const headers = { Authorization: `Bearer ${BITREFILL_API_KEY}` };

    const count = await fetchAndPush(initialUrl, headers);

    return new Response(`✅ Synced ${count} giftcards`, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(`Failed to sync giftcards: ${err.message || err}`, {
      status: 500,
    });
  }
});
