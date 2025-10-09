import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Page({ children }: Props) {
  return (
    <div className="w-full mt-2">
      <div className="container mx-auto bg-card text-card-foreground border-border border-2 rounded-xl">
        {children}
      </div>
    </div>
  );
}
