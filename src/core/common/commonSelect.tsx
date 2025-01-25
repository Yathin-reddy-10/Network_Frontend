import React, { useEffect, useState } from "react";
import Select from "react-select";

export type Option = {
  value?: string;
  label?: string;
  id?: number;
  idName?: string;
  name: string;
  orientation_id?: number;
  class_name_id?: number;
};

export interface SelectProps {
  options: Option[];
  defaultValue?: Option;
  className?: string;
  onChange?: (option: Option | null) => void;
  reset?: boolean;
  value?: string;
  disabled?: boolean;
  required?: boolean; // Add this lines
}

const CommonSelect: React.FC<SelectProps> = ({
  options,
  defaultValue,
  className,
  onChange,
  reset,
  disabled,
  value,
  required, // Add this line
}) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    defaultValue || null
  );

  useEffect(() => {
    setSelectedOption(defaultValue || null);
  }, [defaultValue]);

  useEffect(() => {
    if (reset) {
      setSelectedOption(null); // Reset the selection if reset prop is true
    }
  }, [reset]);

  useEffect(() => {
    if (value) {
      const selected = options.find((option) => option.value === value) || null;
      setSelectedOption(selected);
    }
  }, [value, options]);

  const handleChange = (selectedOption: Option | null) => {
    setSelectedOption(selectedOption);
    if (onChange) {
      onChange(selectedOption);
    }
  };

  return (
    <Select
      classNamePrefix="react-select"
      className={className}
      options={options}
      value={selectedOption}
      onChange={handleChange}
      placeholder="Select"
      isDisabled={disabled}
      required={required} // Add this line
    />
  );
};

export default CommonSelect;
