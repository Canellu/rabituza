'use client';

import { Label } from '@/components/ui/label';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { login, loading, error } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(0);

  const handleLogin = () => {
    login({ identifier, code });
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
            onClick={() => setStep(1)}
            className="from-primary to-primary/70 via-primary/90 bg-gradient-to-b rounded-full"
          >
            Continue
          </Button>
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
              onComplete={handleLogin}
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

            {loading && (
              <p className="text-stone-700">Trying to log you in...</p>
            )}
            {error && (
              <p className="text-stone-700">
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
