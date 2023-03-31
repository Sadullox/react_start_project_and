import { useMemo, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Collapse, Descriptions, Row, Segmented } from "antd";
import {
  AssignDriver,
  Car,
  CarWaiting,
  InWorkingTaxi,
  IonCheckmarkRound,
  LucideAlarmClock,
  MaterialSymbolsAccountCircle,
  MaterialSymbolsLocationOn,
  PhFlagFill,
  WpfPhone,
} from "assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "stores/store";
import ViewTarif from "./viewTarif";
import { phoneNumberFormat } from "functions/formatters";
import { availableKeyBoardNames, orderStatus } from "constant/constant";
import { statusIcons } from "./Table";
import { setAbortModalOpen, setCurrentUpdateId } from "stores/orderDetails";
import { postData } from "functions/request";
import { updateOrder } from "constant/url";

const subStyle = { fontSize: 8, right: 5 };

// function executorStatusIcon(status: any) {
//   return {
//     [orderStatus.appointed]: (
//       <AssignDriver style={{ width: 28, height: 28, fill: "" }} />
//     ),
//     [orderStatus.at_address]: <CarWaiting style={{ width: 28, height: 28 }} />,
//     [orderStatus.in_fetters]: (
//       <InWorkingTaxi style={{ width: 28, height: 28 }} />
//     ),
//   }[status];
// }
export default function View() {
  const [activeTab, setActiveTab] = useState<"ПОДРОБНОСТИ" | "ИСТОРИЯ">();
  const currentView = useSelector((s: RootState) => s.view.state.currentView);
  const dispatch = useDispatch();
  const executor = useMemo(() => {
    return (
      currentView?.status !== orderStatus.new && (
        <div className="content main-content">
          <div className="collapse-header d-flex">
            {statusIcons[currentView?.status]}
            <span>executor info</span>
          </div>
        </div>
      )
    );
  }, [currentView]);

  function update() {
    dispatch(setCurrentUpdateId(currentView?.id));
    postData({
      url: `${updateOrder}/${currentView?.id}`,
      payload: { update_order: true, id: currentView?.id },
    });
  }

  return (
    <div className="order__view">
      <Row className="header">
        <Col span={2}>
          <Button
            icon={<EditOutlined />}
            className={"header__btn"}
            style={{ background: "#2bd" }}
            onClick={update}
            disabled={currentView?.update_order}
          ></Button>
          <sup style={subStyle}>HOME</sup>
        </Col>
        <Col span={2}>
          <Button
            icon={<LucideAlarmClock />}
            className={"header__btn"}
            style={{ background: "rgba(255, 185, 19, 0.5)" }}
          ></Button>
          <sup style={subStyle}>END</sup>
        </Col>
        <Col span={2}>
          <Button
            icon={<Car fill={"#fff"} />}
            className={"header__btn"}
            style={{ background: "#ffb913" }}
          ></Button>
          <sup style={subStyle}>MINUS</sup>
        </Col>
        <Col span={2}>
          <Button
            icon={<IonCheckmarkRound />}
            className={"header__btn"}
            style={{ background: "#d1c025" }}
          ></Button>
          <sup style={subStyle}>F5</sup>
        </Col>
        <Col span={2} offset={14}>
          <Button
            icon={<DeleteOutlined />}
            danger
            style={{ background: "red" }}
            className={"header__btn"}
            id={availableKeyBoardNames.delete__order}
            onClick={() => {
              if (currentView?.id) {
                dispatch(setAbortModalOpen(true));
              }
            }}
          ></Button>
          <sup style={{ ...subStyle, right: 0 }}>DELETE</sup>
        </Col>
      </Row>
      <div className="header__content">
        <Segmented
          block
          options={["ПОДРОБНОСТИ", "ИСТОРИЯ"]}
          onChange={(e: any) => setActiveTab(e as "ПОДРОБНОСТИ" | "ИСТОРИЯ")}
          value={activeTab}
        />
      </div>
      <div className="contents">
        <Collapse expandIconPosition={"end"} className={"content"}>
          <Collapse.Panel
            header={
              <div className="d-flex">
                <LucideAlarmClock />
                <span>{currentView?.create_date}</span>
              </div>
            }
            key="1"
          >
            <Descriptions column={1}>
              <Descriptions.Item label={"id"}>
                {currentView?.number}
              </Descriptions.Item>
            </Descriptions>
          </Collapse.Panel>
        </Collapse>
        <div className="content main-content">
          <div className="collapse-header d-flex">
            <MaterialSymbolsLocationOn className="svg" />
            <span>
              {currentView?.address?.name} [{currentView?.brand?.name}]
            </span>
          </div>
        </div>
        <ViewTarif />
        <div className="content main-content">
          <div
            className="collapse-header d-flex"
            style={{ justifyContent: "space-between" }}
          >
            <div className="d-flex">
              <MaterialSymbolsAccountCircle className="svg" />
              <span>
                {phoneNumberFormat(currentView?.client?.phone || "")}{" "}
                {currentView?.client?.given_names &&
                  `[${currentView?.client?.given_names}]`}
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <Button
                icon={<WpfPhone style={{ cursor: "pointer" }} />}
                type="primary"
                size="small"
              ></Button>
              <sup style={{ right: -8 }}>F1</sup>
            </div>
          </div>
        </div>
        <div className="content main-content">
          <div className="collapse-header d-flex">
            <PhFlagFill className="svg" />
            <span style={{ fontSize: 13 }}>
              {currentView?.routes
                ?.map((route: any) => {
                  return (
                    route?.address?.parent?.name + " " + route?.address?.name
                  );
                })
                ?.join(" --- ")}
            </span>
          </div>
        </div>
        {executor}
      </div>
    </div>
  );
}
