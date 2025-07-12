import { DropData } from '../type';
import ComposeCastCTA from './ComposeCastCTA';

interface Props {
  drop: DropData;
}

const CreatorActions: React.FC<Props> = ({ drop }) => {
  if (drop.cast_hash) {
    return null;
  }

  return (
    <div className="p-4 border rounded-lg bg-blue-50 text-sm text-blue-800">
      {drop.invoice_status === 'all_delivered' && !drop.cast_hash && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h3 className="text-yellow-700 font-semibold mb-2">
            📣 You haven’t posted this drop to Farcaster yet!
          </h3>
          <ComposeCastCTA drop={drop} />
        </div>
      )}
      {drop.invoice_status !== 'all_delivered' && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-lg">
            Please wait while we confirm your payment...
          </p>
        </div>
      )}
    </div>
  );
};

export default CreatorActions;
