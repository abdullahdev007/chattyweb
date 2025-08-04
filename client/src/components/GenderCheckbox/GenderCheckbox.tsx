import { Gender } from "@shared/types/types";
import React from "react";

interface GenderCheckboxProps {
  onCheckboxChange: (gender: Gender) => void;
  selectedGender: Gender;
}

const GenderCheckbox: React.FC<GenderCheckboxProps> = ({
  onCheckboxChange,
  selectedGender,
}) => {
  return (
    <div className="flex justify-center">
      <div className="form-control">
        <label
          className={`label gap-2 cursor-pointer ${
            selectedGender === "male" ? "selected" : ""
          }`}
        >
          <span className="label-text">Male</span>
          <input
            type="checkbox"
            className="checkbox border-salte-900"
            checked={selectedGender === "male"}
            onChange={() => onCheckboxChange("male")}
          />
        </label>
      </div>
      <div>
        <label
          className={`label gap-2 cursor-pointer ${
            selectedGender === "female" ? "selected" : ""
          }`}
        >
          <span className="label-text">Female</span>
          <input
            type="checkbox"
            className="checkbox border-salte-900"
            checked={selectedGender === "female"}
            onChange={() => onCheckboxChange("female")}
          />
        </label>
      </div>
    </div>
  );
};

export default GenderCheckbox;
