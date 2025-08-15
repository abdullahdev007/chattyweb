import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="footer flex justify-center mb-2" id="footer">
      <span className="copyright text-white  z-10  flex font-bold text-md">
        © This site was developed by{" "}
        <a
          className={"transition hover:scale-105 text-blue-500"}
          href={import.meta.env.VITE_DEVELOPER_PORTFOLIO}
        >
          Alquser Abdullah
        </a>
      </span>
    </footer>
  );
};

export default Footer;
