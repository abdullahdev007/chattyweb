import { Gender } from "@shared/types/types";
import React from "react";
import { FaMars, FaVenus } from "react-icons/fa";

interface GenderCheckboxProps {
  onCheckboxChange: (gender: Gender) => void;
  selectedGender: Gender;
}

const GenderCheckbox: React.FC<GenderCheckboxProps> = ({
  onCheckboxChange,
  selectedGender,
}) => {
  return (
    <div className="flex gap-4 justify-center">
      {/* Male Option */}
      <label
        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
          selectedGender === "male"
            ? "border-primary bg-primary/10 text-primary"
            : "border-base-300 bg-base-100 text-base-content hover:border-primary/50"
        }`}
      >
        <input
          type="radio"
          name="gender"
          className="radio radio-primary"
          checked={selectedGender === "male"}
          onChange={() => onCheckboxChange("male")}
        />
        <FaMars className="text-lg" />
        <span className="font-medium">Male</span>
      </label>

      {/* Female Option */}
      <label
        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
          selectedGender === "female"
            ? "border-secondary bg-secondary/10 text-secondary"
            : "border-base-300 bg-base-100 text-base-content hover:border-secondary/50"
        }`}
      >
        <input
          type="radio"
          name="gender"
          className="radio radio-secondary"
          checked={selectedGender === "female"}
          onChange={() => onCheckboxChange("female")}
        />
        <FaVenus className="text-lg" />
        <span className="font-medium">Female</span>
      </label>
    </div>
  );
};

export default GenderCheckbox;
