import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Home = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Link
        href="/goals"
        className="bg-primary rounded-full px-5 py-3 font-medium flex gap-3"
      >
        Get started
        <ArrowRight className="bg-white rounded-full p-1" />
      </Link>
    </div>
  );
};

export default Home;
