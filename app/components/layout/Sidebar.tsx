"use client";

import { signIn, signOut } from "next-auth/react";
import { useEffect} from "react";
import { useStore } from "../../state/useStore";
export const links = [
  { text: "LOG-IN", onClick: () => signIn("google") },
  { text: "DASHBOARD", href: "/dashboard" },
  { text: "F.A.Q.", href: "/#faq" },
  { text: "LOG-OUT", onClick: () => signOut(), img: "/leave.png" },
];
// sidebar
const Sidebar = () => {
  const { user } = useStore();

  

  useEffect(() => {
    if (window.location.hash) {
      // Remove the hash from the URL without scrolling the page
      window.history.replaceState(
        null,
        document.title,
        window.location.pathname
      );
    }
  }, []);
  return (
    <div className="w-[17rem] relative  min-h-full  bg-[#261f1d]">
      {/* <div className="py-6 fixed ml-8 ">
        <img
          className="w-[12rem] m-auto mb-4 border-b-white border-b"
          src="/marcylogo1.png"
          alt="Logo"
        />
        <ul>
          {user && (
            <div className="flex pb-2 mb-5 border-b  gap-2">
              <img
                className="w-[3rem] h-[3rem] rounded-full m-auto"
                src={user.image!}
                alt="User Image"
              />
              <div className="self-center">
                <p className=" text-[1.3rem] text-white text-center">
                  {user.name?.toUpperCase()}
                </p>
              </div>
            </div>
          )}
          {links.map((link, index) => (
            <a href={link.href}>
              <li
                key={index}
                onClick={link.onClick}
                className={`group cursor-pointer  ${
                  shouldHideLink(link.text) ? "hidden" : ""
                }`}
              >
                <p className="pb-3 flex text-white duration-200 text-[1.5rem]">
                  {link.text}
                  {link.img ? (
                    <img
                      src={link.img}
                      className=" self-center ml-3 invert w-[1.5rem] h-[1.5rem]"
                    />
                  ) : (
                    <span className="group-hover:opacity-100 duration-300 group-hover:pl-1 opacity-0">
                      →
                    </span>
                  )}
                </p>
              </li>
            </a>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default Sidebar;
