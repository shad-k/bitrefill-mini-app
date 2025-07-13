import { SignInButton } from '@farcaster/auth-kit';

const DropPageSignInCTA = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded text-center">
      <p className="text-sm text-blue-700 mb-2">
        Want to join the drop? Login with your Farcaster account!
      </p>
      <div className="flex items-center justify-center">
        <SignInButton />
      </div>
    </div>
  );
};

export default DropPageSignInCTA;
