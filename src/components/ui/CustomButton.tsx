import React from "react";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  children,
  className,
  type = "button",
  disabled,
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-hover btn-disabled ${className ?? ""}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default CustomButton;
