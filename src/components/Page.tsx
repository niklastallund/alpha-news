import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Page({ children }: Props) {
  return (
    <div className="w-full mt-2">
      <div className="container mx-auto rounded-xl lg:max-w-7xl max-w-xl">
        {children}
      </div>
    </div>
  );
}
