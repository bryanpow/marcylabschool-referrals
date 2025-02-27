"use client";
import { useState, useEffect, useRef } from "react";

interface ButtonProps {
  text: string;
  invert?: boolean;
  className?: string;
  onClick?: any;
  href?: string;
}

// Animated button component
function Button({ text, invert, className, onClick}: ButtonProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hovered && !invert
      ? (bgRef.current!.style.transform = "translateX(0%)")
      : (bgRef.current!.style.transform = "translateX(-100%)");
  }, [hovered]);

  return (
   
    <button
      onClick={ () => onClick? onClick(): null}
      className={`w-[10rem] z-[1] ${className} `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={` m-auto overflow-hidden  relative ${
          invert ? "" : "border-[0.2rem]"
        }   ${
          invert ? "hover:text-[#261f1d]" : "hover:text-white backdrop-blur"
        } duration-300   w-[12rem] border-[#261f1d] py-2 font-bold ${
          invert ? "" : "text-center"
        }`}
      >
        <span className="relative pr-5 z-[10]">
          {text}
          <span
            className={` absolute  transition-[padding] duration-500 ${
              hovered && "pl-1"
            }`}
          >
            →
          </span>
        </span>

        <div
          ref={bgRef}
          className="absolute translate-x-[-100%] z-[2] duration-300 inset-0 bg-[#261f1d] w-full h-full"
        ></div>
      </div>
    </button>
 
  );
}

export default Button;
