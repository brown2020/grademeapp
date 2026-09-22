import React from "react";

interface CustomButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  children,
  className,
  type = "button",
  disabled,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-hover btn-disabled ${className ?? ""}`}
    >
      {children}
    </button>
  );
};

export default CustomButton;
