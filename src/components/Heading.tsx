/* eslint-disable space-before-function-paren */
/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable jsx-quotes */
import React from "react";

const Heading = (props: any) => {
  return (
    <h1 className="heading" {...props}>
      {props.children}
    </h1>
  );
};

export default Heading;
