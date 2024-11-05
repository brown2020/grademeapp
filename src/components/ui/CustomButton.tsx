import React from "react";

interface CustomButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, children, className }) => {

    return (
        <div
            onClick={onClick}
            className={`btn btn-hover btn-disabled ${className}`}
        >
            {children}
        </div>
    );
};

export default CustomButton;
