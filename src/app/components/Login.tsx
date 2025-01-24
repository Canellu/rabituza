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
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { verifyUserIdentifier, verifyUserCode, loading, error } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(0);

  const handleVerifyIdentifier = () => {
    verifyUserIdentifier(identifier); // Trigger identifier verification mutation

    // Using mutation's onSuccess and onError to control step transition
    if (error) {
      console.error(error); // Handle any error during identifier verification
      setStep(0); // Keep the user on the identifier step
    } else {
      setStep(1); // Move to step 1 if identifier is successfully verified
    }
  };

  const handleVerifyCode = () => {
    verifyUserCode(code); // Trigger code verification mutation

    // Check for any error in code verification
    if (error) {
      console.error(error); // Handle error during code verification
    } else {
      alert('Code verified successfully!'); // Add any post-verification logic here
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {step === 0 && (
        <section className="flex items-center justify-center flex-col gap-6 p-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Enter your email or username</Label>
            <Input
              type="text"
              id="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Rabituza"
            />
          </div>
          <Button
            onClick={handleVerifyIdentifier}
            className="from-primary to-primary/70 via-primary/90 bg-gradient-to-b rounded-full"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Verifying...' : 'Continue'}
          </Button>
          {error && <p className="text-red-500">Error: {error}</p>}
        </section>
      )}
      {step === 1 && (
        <section className="flex items-center justify-center flex-col gap-6 p-4">
          <div className="flex flex-col gap-16 items-center justify-center">
            <Label htmlFor="code" className="text-xl text-stone-700">
              Enter code provided
            </Label>
            <InputOTP
              maxLength={6}
              id="code"
              value={code}
              onChange={(value) => setCode(value)}
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

            <Button
              onClick={handleVerifyCode}
              className="from-primary to-primary/70 via-primary/90 bg-gradient-to-b rounded-full"
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>
            {loading && (
              <p className="text-stone-700">Trying to log you in...</p>
            )}
            {error && (
              <p className="text-red-500">
                Unable to log you in, reason: {error}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Login;
