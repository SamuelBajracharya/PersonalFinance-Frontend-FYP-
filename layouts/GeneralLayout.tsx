import { LayoutPropsType } from "@/types/viewport";
import React from "react";

const GeneralLayout = ({ children }: LayoutPropsType) => {
  return <div className="theme-transition">{children}</div>;
};

export default GeneralLayout;
