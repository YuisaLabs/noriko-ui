import React from "react";
import { cn } from "@/utils/classes";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ className, ...props }: ButtonProps) => {
  return (
    <button className={cn("rounded-md bg-blue-500 px-4 py-2 text-white", className)} {...props}>
      {props.children}
    </button>
  );
}