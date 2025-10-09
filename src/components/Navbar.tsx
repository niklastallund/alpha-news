import Image from "next/image";
import NavbarMenu from "./NavbarMenu";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 border-b-2 border-border backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-center p-2">
        <Image
          src="/tmplogo.png"
          alt="Logo"
          width={100}
          height={100}
          className="w-auto mx-0 px-5"
        />
        <NavbarMenu />
      </div>
    </nav>
  );
}
