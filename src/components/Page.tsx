import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Page({ children }: Props) {
  return (
    <div className="w-full">
      <div className="container mx-auto bg-card text-card-foreground">
        {children}
      </div>
    </div>
  );
}
