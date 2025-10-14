import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Page({ children }: Props) {
  return (
    <div className="w-full mt-2">
      <div className="container mx-auto bg-card text-card-foreground rounded-xl max-w-7xl">
        {children}
      </div>
    </div>
  );
}
