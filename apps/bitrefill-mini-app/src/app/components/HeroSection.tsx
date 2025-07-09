import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
        Drop Gift Cards on Farcaster
      </h1>
      <Image src="/giftbox.png" alt="Gift Box" width={250} height={250} className="mx-auto" />
      <p className="text-lg md:text-xl font-sans text-gray-600 mb-8">
        Create limited-time Bitrefill gift card drops based on reactions or replies to your casts.
      </p>
    </section>
  );
}
