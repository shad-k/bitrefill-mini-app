export default function HowItWorks() {
  return (
    <section className="mt-24 max-w-3xl mx-auto text-center">
      <h2 className="text-2xl font-heading font-semibold mb-6">How it works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div>
          <h3 className="text-lg font-semibold mb-2">1. Create a Drop</h3>
          <p className="text-sm text-gray-600">Choose a gift card, set the quantity and criteria (reaction or reply).</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">2. Share Your Cast</h3>
          <p className="text-sm text-gray-600">We post a cast for you. Friends participate by reacting or replying.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">3. Winners Reveal</h3>
          <p className="text-sm text-gray-600">After the deadline, eligible users can reveal their gift cards.</p>
        </div>
      </div>
    </section>
  );
}
