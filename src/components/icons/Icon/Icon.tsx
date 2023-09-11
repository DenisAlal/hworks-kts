import * as React from "react";
export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color?: "primary" | "secondary" | "accent";
};
const primaryColor = "#000000";
const secondaryColor = "#AFADB5";
const accentColor = "#518581";
const Icon: React.FC<React.PropsWithChildren<IconProps>> = (props) => {
  const { color, width = "24", height = "24", children, ...restProps } = props;
  let newHeight = height;
  let newWidth = width;
  if (!newHeight || Number(newHeight) < 1) {
    newHeight = 24;
  }
  if (!newWidth || Number(newWidth) < 1) {
    newWidth = 24;
  }
  let SVGColor = primaryColor;
  switch (color) {
    case "accent":
      SVGColor = accentColor;
      break;
    case "secondary":
      SVGColor = secondaryColor;
      break;
  }
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width={newWidth}
      height={newHeight}
      fill={SVGColor}
      strokeWidth={0}
      stroke={SVGColor}
      {...restProps}
    >
      {children}
    </svg>
  );
};

export default Icon;
