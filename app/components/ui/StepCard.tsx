import Link from "next/link";
import Button from "./Button";
import Image from "next/image";

interface StepCardProps {
  color: string;
  img: string;
  title: string;
  body: string;
  step: number;
  button?: { text: string; invert: boolean };
  href?: string;
}

function StepCard({ color, img, title, body, step, button }: StepCardProps) {
  return (
    <div>
      <div className="flex align-middle gap-3 ">
        {" "}
        <h1
          className={`h-[3.5rem] font-medium  mt-5  pb-2 text-[2.3rem] rounded-full text-center  w-[3.5rem]`}
          style={{ backgroundColor: color }}
        >
          {step}
        </h1>{" "}
        <h1 className="pt-7  font-medium pl-3 text-[1.6rem] sm-text-[1.8rem]">
          {title}
        </h1>
      </div>
      <div className="flex flex-col  md:flex-row gap-5 justify-between">
        <div>
          <p className=" pt-10 [@media(max-width:1005px)]:w-[100%] text-[1.4rem] font-medium  md:text-[1.3rem] w-[30rem]">
            {body}
          </p>
          <div className="pt-3">
            {button && (
              <Link href={(button as any).href || ""}>
                <Button
                  text={button.text}
                  href={(button as any).href}
                  onClick={null}
                  invert={button.invert}
                />
              </Link>
            )}
          </div>
        </div>

        <Image
          alt="step"
          width={500}
          height={500}
          className="   md:w-[40%]  pt-10  "
          src={img}
        ></Image>
      </div>
    </div>
  );
}

export default StepCard;
