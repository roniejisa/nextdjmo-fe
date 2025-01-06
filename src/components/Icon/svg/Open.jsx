import React from "react";

const Open = ({...props}) => {
  return (
    <svg
      {...props}
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-xl"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 21v-4a3 3 0 0 1 3 -3h5"></path>
      <path d="M8 17l3 -3l-3 -3"></path>
      <path d="M3 11v-5a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8"></path>
    </svg>
  );
};

export default Open;
