import { FC } from "react";
import "./StarBackground.scss";

const StarBackground: FC = () => {
  return (
    <div className="background-container">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png"
        className="moonImage"
        alt="Moon"
      />
      {/* <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="clouds"></div> */}
    </div>
  );
};

export default StarBackground;
