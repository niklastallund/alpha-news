import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Page({ children }: Props) {
  return (
    <div className="w-full">
      <div className="container mx-auto rounded-xl lg:max-w-7xl max-w-xl mt-8 px-4">
        {children}
      </div>
    </div>
  );
}
