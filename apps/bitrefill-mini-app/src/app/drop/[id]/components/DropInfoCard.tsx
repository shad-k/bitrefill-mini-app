import { CountdownTimer } from './CountdownTimer';

type Props = {
  name: string;
  amount?: string | number;
  quantity: number;
  deadline: string;
};

const DropInfoCard = ({ name, amount, quantity, deadline }: Props) => {
  return (
    <div className="border border-gray-300 p-4 rounded-xl shadow-sm space-y-2">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p>
        💸 Prize: <strong>{amount}</strong>
      </p>
      <p>
        🏆 Winners: <strong>{quantity}</strong>
      </p>
      <p>⏰ Announcement in:</p>
      <CountdownTimer deadline={deadline} />
    </div>
  );
};

export default DropInfoCard;
