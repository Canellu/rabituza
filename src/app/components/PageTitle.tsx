import { Separator } from "@/components/ui/separator";

const PageTitle = ({ title }: { title: string }) => {
  return (
    <>
      <h1 className="text-xl font-bold tracking-wide capitalize">{title}</h1>
      <Separator className="mt-2 mb-4" />
    </>
  );
};

export default PageTitle;
