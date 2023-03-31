import React from "react";
import { Form, Mentions } from "antd";
import { formatMessage } from "language/Lang";

function Note() {
  return (
    <Form.Item name={"comment"} label={formatMessage("comment")}>
      <Mentions placeholder={formatMessage("comment")}></Mentions>
    </Form.Item>
  );
}

export default Note;
