import React from "react";
import "./style.scss"

export default function Header({
    title
}) {
  return (
    <div className="global__header">
        <div className="header_text">
            {title}
        </div>
        <div className="header_body">

        </div>
    </div>
  );
}
