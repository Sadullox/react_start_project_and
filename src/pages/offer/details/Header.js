import React from "react";
// import GlobalHeader from "components/header/Header";
// import { orderMenu } from "constant/routers";
import { Button } from "antd";
// import BusyDriver from "./busyDriver";
// import FreeDriver from "./freeDriver";

export default function Header() {
  function mapClick() {
    // window.open(
    //   "https://hive-andijon.royaltaxi.uz/map.html?lang=ru",
    //   "_blank",
    //   "width=1000,height=1000"
    // );
  }
  return (
    <div className="order__header">
      {/* <GlobalHeader menu={orderMenu} /> */}
      <div className="cars__info">
        <Button style={{ marginRight: "10px" }} onClick={mapClick}>
          Xarita
        </Button>
        <div className="cars">
          {/* <FreeDriver /> */}
          {/* <Tooltip title={"Free"} placement="bottom">
            <div className="car" style={{ marginRight: "10px" }}>
              <Car fill={"#ccc"} />
              <span>15004587</span>
            </div>
          </Tooltip> */}
          {/* <BusyDriver /> */}
        </div>
        <div className="help"></div>
      </div>
    </div>
  );
}
