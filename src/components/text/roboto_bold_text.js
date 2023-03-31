import React from "react";
import "./style.scss"

export const RobotoBoldText = React.memo((props) => {
    return (
        <p style={{
            fontWeight:700,
            fontSize:props.size
        }} >
            Salom
        </p>
    );
  }, []);

