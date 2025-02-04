'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import {
  getUserByIdentifier,
  VerifyLoginError,
  verifyUserCode,
} from '@/lib/auth/verifyLogin';
import { cn } from '@/lib/utils';
import sleep from '@/lib/utils/sleep';
import { setSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Spinner from './Spinner';

const Login = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // useQuery with enabled set to false by default
  const { data: user, refetch } = useQuery({
    queryKey: ['user', identifier],
    queryFn: () => getUserByIdentifier(identifier),
    enabled: false, // Will not fetch until manually triggered
  });

  const handleVerifyUser = async () => {
    setError(''); // Clear previous errors
    setLoading(true);

    try {
      await sleep(250); // Add artificial delay
      const result = await refetch(); // Trigger query
      if (result.data && result.data.length > 0) {
        setStep(1); // Move to the next step if user is found
      } else {
        setError('User not found');
      }
    } catch (error) {
      setError('An error occurred while fetching user: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError('Code must be 6 digits long');
      return;
    }

    setLoading(true);
    try {
      await sleep(250); // Add artificial delay
      verifyUserCode(user![0], code);
      setSession(user![0].id);
      router.refresh();
    } catch (error) {
      setLoading(false);
      setError((error as VerifyLoginError).message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-dvh">
      {step === 0 && (
        <section className="flex items-center justify-center flex-col gap-12 p-4">
          <Label
            htmlFor="username"
            className="text-xl max-w-48 text-center text-stone-700"
          >
            Enter your email or username
          </Label>

          <div className="relative">
            <Input
              type="text"
              id="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value.trim())}
              placeholder="Rabituza"
              onKeyDown={(e) => e.key === 'Enter' && handleVerifyUser()}
              onFocus={() => setError('')}
            />

            <p
              className={cn(
                'absolute -bottom-9 text-red-500 bg-red-100 rounded-md py-1 px-3 w-full text-center',
                error ? 'visible' : 'invisible'
              )}
            >
              {error}
            </p>
          </div>
          <Button
            onClick={handleVerifyUser}
            className="from-primary to-primary/70 via-primary/90 bg-gradient-to-b"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Continue'}
          </Button>
        </section>
      )}
      {step === 1 && (
        <section className="flex items-center justify-center flex-col gap-12 p-4">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setStep(0)}
            className="absolute left-4 top-4"
          >
            <ArrowLeft className="!size-5" />
          </Button>
          <Label
            htmlFor="code"
            className="text-xl max-w-48 text-center text-stone-700"
          >
            Enter code provided
          </Label>

          <div className="relative">
            <InputOTP
              maxLength={6}
              id="code"
              value={code}
              onChange={(value) => setCode(value)}
              onFocus={() => setError('')}
              onComplete={handleVerifyCode}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p
              className={cn(
                'absolute -bottom-9 text-red-500 bg-red-100  rounded-md py-1 px-3 w-full text-center',
                error ? 'visible' : 'invisible'
              )}
            >
              {error}
            </p>
          </div>

          <Button
            onClick={handleVerifyCode}
            className="from-primary to-primary/70 via-primary/90 bg-gradient-to-b text-stone-700"
            disabled={loading} // Disable button while loading
          >
            {loading && <Spinner color="text-stone-700" />}
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </section>
      )}
    </div>
  );
};

export default Login;
