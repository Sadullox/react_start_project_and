import DepartureTime from "pages/order/details/modal/details/departureTime";
import From from "./details/from";
import To from "pages/order/details/modal/details/to";
import { FormInstance } from "antd";
import Desire from "pages/order/details/modal/details/desire";
import Note from "pages/order/details/modal/details/note";

// const parentStyle = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   flexDirection: "column",
//   height: "100%",
// };
export default function ModalAddresses({
  fromRef,
  form,
}: {
  fromRef: any;
  form: FormInstance;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ width: "100%" }}>
        <DepartureTime />
        <From fromRef={fromRef} form={form} />
        <To />
      </div>
      <div style={{ width: "100%" }}>
        <Desire />
        <Note />
      </div>
    </div>
  );
}
