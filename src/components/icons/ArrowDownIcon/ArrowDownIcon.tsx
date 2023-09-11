import * as React from "react";
import Icon, { IconProps } from "../Icon";

const ArrowDownIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.335 8.747L3.664 7.253L12 14.662L20.336 7.253L21.664 8.747L12 17.338L2.335 8.747Z"
        />
      </svg>
    </Icon>
  );
};

export default ArrowDownIcon;
