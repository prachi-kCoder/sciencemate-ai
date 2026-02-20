import React from "react";
import Latex from "react-latex-next";

interface LatexRendererProps {
  children: string;
  className?: string;
}

const LatexRenderer: React.FC<LatexRendererProps> = ({ children, className }) => {
  return (
    <span className={className}>
      <Latex>{children}</Latex>
    </span>
  );
};

export default LatexRenderer;
