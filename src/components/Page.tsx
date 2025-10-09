import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Page({ children }: Props) {
  return (
    <div className="w-full mt-2">
      <div className="p-2 container mx-auto bg-card text-card-foreground">
        {children}
      </div>
    </div>
  );
}
