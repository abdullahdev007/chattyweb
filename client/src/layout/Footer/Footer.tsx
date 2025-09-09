import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="footer flex justify-center pb-2 min-h-10" id="footer">
      <span
        className="copyright text-base-content z-10  flex flex-wrap items-center font-bold text-xs sm:text-xs md:text-sm lg:text-base flex justify-center
"
      >
        © This site was developed by
        <a
          className={"transition hover:scale-105 text-primary underline"}
          href={import.meta.env.VITE_DEVELOPER_PORTFOLIO}
        >
          Alquser Abdullah
        </a>
      </span>
    </footer>
  );
};

export default Footer;
