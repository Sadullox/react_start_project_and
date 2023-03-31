import { useEffect } from "react";
import Header from "../../components/header/header";
import { IonLocationSharp } from "../../components/icons";
import { RobotoBoldText } from "../../components/text/roboto_bold_text";

function Offer() {
  return (
    <div className="offer_page">
      <Header 
        title={<RobotoBoldText size={20} title={"Offer"}  />}
      />
    </div>
  );
}

export default Offer;
