import { ReactNode } from "react";
import Menu from "./Menu";
import PageTitle from "./PageTitle";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Menu />
      <main className="p-4">
        <PageTitle />
        {children}
      </main>
    </>
  );
};

export default Layout;
