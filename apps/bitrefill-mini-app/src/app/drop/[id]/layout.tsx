import { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { id } = await params;

  const miniapp = {
    version: '1',
    imageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/drop/${id}/opengraph-image`,
    button: {
      title: 'Checkout the Drop',
      action: {
        type: 'launch_miniapp',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/drop/${id}`,
        name: 'Bitrefill Drop',
        splashImageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/giftbox.png`,
        splashBackgroundColor: '#f5f0ec',
      },
    },
  };

  const frame = {
    version: '1',
    imageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/drop/${id}/opengraph-image`,
    button: {
      title: 'Checkout the Drop',
      action: {
        type: 'launch_frame',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/drop/${id}`,
        name: 'Bitrefill Drop',
        splashImageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/giftbox.png`,
        splashBackgroundColor: '#f5f0ec',
      },
    },
  };

  return {
    other: {
      'fc:miniapp': JSON.stringify(miniapp),
      'fc:frame': JSON.stringify(frame),
    },
  };
}

const DropLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="max-w-2xl mx-auto p-4">{children}</div>;
};
export default DropLayout;
