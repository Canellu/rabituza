"use client";

import { Button } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ArrowRight } from "lucide-react";
import useVibrate from "./hooks/useVibrate";

const Login = () => {
  const vibrationPattern = [3000, 500, 3000];

  const vibrate = useVibrate(vibrationPattern);

  const handleVibrate = () => {
    alert("Bzzz Bzzzz!");
    vibrate();
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-8">
      <Button onClick={handleVibrate}>Vibrate</Button>
      <LoginLink
        postLoginRedirectURL="/home"
        className="bg-primary rounded-full px-6 py-3 font-medium flex gap-3"
      >
        Sign in
        <ArrowRight className="bg-white rounded-full p-1" />
      </LoginLink>
    </div>
  );
};

export default Login;
