import type { ReactNode } from "react";
import Header from "./Header";

interface PageProps {
  title: string;
  icon: string;
  children: ReactNode;
}
export function Page({ title, children, icon }: PageProps) {
  return (
    <>
      <Header title={title} icon={icon} />
      <main className="flex flex-col items-center px-4 py-6 text-base lg:px-8 sm:px-6">
        {children}
      </main>
    </>
  );
}
