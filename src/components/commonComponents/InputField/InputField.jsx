import React from "react";
import { Input } from "antd";
import "./InputField.scss";

const InputField = (props) => {
  return (
    <div>
      {props.type === "password" ? (
        <Input.Password
          className="inputStyling"
          placeholder={props.placeholder}
          type="password"
          value={props.value}
          onChange={props.onChange}
          name={props.name}
        />
      ) : (
        <Input
          className="inputStyling"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          name={props.name}
          disabled={props.disabled}
        />
      )}
    </div>
  );
};

export default InputField;
