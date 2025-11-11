import React, { useRef } from "react";

type ButtonSize = "large" | "medium" | "small";
type ButtonColor = "cta" | "dark" | "light";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  color?: ButtonColor;
  href?: string;
}

const Button: React.FC<ButtonProps> = (props) => {
  const { children, size, color, href, ...rest } = props;

  const common = useRef(
    "relative inline-block font-subheading shadow-default rounded-xl transition-transform overflow-hidden before:absolute before:bg-linear-to-r before:left-[-100%] before:block before:w-full before:h-full before:rotate-90 hover:before:animate-shine hover:cursor-pointer hover:scale-105",
  );

  const buttonSize = useRef(
    (() => {
      switch (size) {
        case "large":
          return "text-3xl px-6 py-4 mt-6";
        case "medium":
          return "text-2xl px-4 py-4 mt-4";
        default:
          return "text-2xl px-4 py-2";
      }
    })(),
  );

  const buttonColor = useRef(
    (() => {
      switch (color) {
        case "cta":
          return "bg-call-to-action-default text-dark-default shadow-call-to-action-900   before:from-light-secondary-50/20 before:to-light-50/20 hover:bg-call-to-action-800";
        case "light":
          return "bg-light-secondary-default text-dark-default shadow-light-secondary-900   before:from-light-secondary-50/20 before:to-light-50/20 hover:bg-light-secondary-800";
        default:
          return "bg-dark-secondary-default text-light-default shadow-dark-900   before:from-light-secondary-50/20 before:to-light-50/20 hover:bg-dark-secondary-800";
      }
    })(),
  );

  if (href != null) {
    return (
      <a
        href={href}
        className={`${common.current} ${buttonSize.current} ${buttonColor.current}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={`${common.current} ${buttonSize.current} ${buttonColor.current}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
