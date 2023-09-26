import * as React from "react";
export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color?: "primary" | "secondary" | "accent" | "white";
};
const primaryColor = "#000000";
const secondaryColor = "#AFADB5";
const accentColor = "#518581";
const whiteColor = "#ffffff";
const Icon: React.FC<React.PropsWithChildren<IconProps>> = (props) => {
  const { color, width = "24", height = "24", children, ...restProps } = props;

  let svgColor = primaryColor;
  switch (color) {
    case "accent":
      svgColor = accentColor;
      break;
    case "secondary":
      svgColor = secondaryColor;
      break;
    case "white":
      svgColor = whiteColor;
      break;
  }
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={svgColor}
      strokeWidth={0}
      stroke={svgColor}
      {...restProps}
    >
      {children}
    </svg>
  );
};

export default Icon;
