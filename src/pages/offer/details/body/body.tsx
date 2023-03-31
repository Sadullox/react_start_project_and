import React from "react";
import List from "./list";
import View from "./view";

export default function Body() {
  return (
    <div className="order__body">
      <List />
      <View />
    </div>
  );
}
