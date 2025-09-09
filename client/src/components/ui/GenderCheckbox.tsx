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
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
      {/* Male Option */}
      <label
        className={`flex items-center justify-center gap-3 p-3 sm:p-3.5 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] sm:hover:scale-105 w-full sm:w-auto text-sm sm:text-base ${
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
        <FaMars className="text-base sm:text-lg" />
        <span className="font-medium">Male</span>
      </label>

      {/* Female Option */}
      <label
        className={`flex items-center justify-center gap-3 p-3 sm:p-3.5 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] sm:hover:scale-105 w-full sm:w-auto text-sm sm:text-base ${
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
        <FaVenus className="text-base sm:text-lg" />
        <span className="font-medium">Female</span>
      </label>
    </div>
  );
};

export default GenderCheckbox;
