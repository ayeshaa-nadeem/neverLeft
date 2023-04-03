import React from "react";
import { Button, Spin } from "antd";
import "./NLBtn.scss";

const NLBtn = (props) => {
  return (
    <div>
      <Button
        className={
          props.disabled && props.greyDisabledButton
            ? "diabled"
            : props.disabled && props.savedisabled
            ? "largeBtndisabled"
            : "NLBtn"
        }
        type={props.type}
        htmlType={props.htmlType}
        disabled={props.disabled}
        onClick={props.onClick}
      >
        {props.showSpinner ? <Spin /> : props.title}
      </Button>
    </div>
  );
};

export default NLBtn;
