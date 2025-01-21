"use client";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ArrowRight } from "lucide-react";
import UpdateNotification from "./components/UpdateNotification";

const Login = () => {
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-8">
      <UpdateNotification />
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
