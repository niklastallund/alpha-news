import Image from "next/image";

import { getSessionData } from "@/lib/actions/sessiondata";

export default async function UserPic() {
  const session = await getSessionData();

  return (
    <div>
      <Image
        src={session?.user.image ?? "/defaultuserpic.png"}
        className="w-1/3 md:w-full mx-auto rounded-lg border-2"
        width="111"
        height="111"
        alt="userpic"
      ></Image>
    </div>
  );
}
