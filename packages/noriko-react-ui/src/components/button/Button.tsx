import React from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      className={cn("px-4 py-2 rounded bg-black text-white", className)}
      {...props}
    >
      {children}
    </button>
  );
};
