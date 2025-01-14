import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-8">
      <LoginLink className="bg-primary rounded-full px-5 py-3 font-medium flex gap-3">
        Sign in
        <ArrowRight className="bg-white rounded-full p-1" />
      </LoginLink>

      <RegisterLink>Sign up</RegisterLink>
    </div>
  );
};

export default Home;
