import * as React from 'react';
import type { SVGProps } from 'react';
const Indent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m3 8 4 4-4 4M21 12H11M21 6H11M21 18H11"
    />
  </svg>
);
export default Indent;