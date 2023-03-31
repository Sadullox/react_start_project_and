import { useMemo, useCallback } from "react";
import { Table as AntdTable, Tooltip } from "antd";
import { IExecutor, IExecutorList } from "types/response";
import {
  AssignDriver,
  BxsWalletAlt,
  CarWaiting,
  InWorkingTaxi,
  LucideAlarmClock,
  PhFlagFill,
  RacingController,
  Robot,
  WpfPhone,
} from "assets/icons";
import { orderStatus } from "constant/constant";
import { formatMessage } from "language/Lang";
import { stateNumberFormat } from "functions/formatters";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "stores/store";
import { getData } from "functions/request";
import { setViewState } from "stores/view";

export const statusIcons = {
  [orderStatus.in_fetters]: (
    <Tooltip placement="right" title={formatMessage("order_processing")}>
      <InWorkingTaxi style={{ fill: "#9ebc63" }} />
    </Tooltip>
  ),
  [orderStatus.appointed]: (
    <Tooltip placement="right" title={formatMessage("driver_assigned")}>
      <AssignDriver style={{ fill: "#297fb8" }} />
    </Tooltip>
  ),
  [orderStatus.at_address]: (
    <Tooltip placement="right" title={formatMessage("at_address")}>
      <CarWaiting style={{ fill: "#16a086" }} />
    </Tooltip>
  ),
  [orderStatus.new]: (
    <Tooltip placement="right" title={formatMessage("new_order")}>
      <PhFlagFill style={{ fill: "var(--order-color)" }} />
    </Tooltip>
  ),
  [orderStatus.sending]: (
    <Tooltip placement="right" title={formatMessage("auto_assignment")}>
      <Robot fill={"#2bd1f2"} />
    </Tooltip>
  ),
};
export default function Table() {
  const list = useSelector((s: RootState) => s.orderDetails.lessOrders);
  const id = useSelector((s: RootState) => s.view.state.currentView?.id);
  const dispatch = useDispatch();
  const columns = useMemo(() => {
    return [
      {
        title: "ВРЕМЯ",
        align: "center",
        render: (text: IExecutorList) => {
          return (
            <div className="cell__clock">
              <WpfPhone className="phone" />
              <div className="clock">
                <span>{text?.create_date}</span>
              </div>
            </div>
          );
        },
        width: 120,
      },
      {
        title: "СТАТУС",
        dataIndex: "status",
        render: (text: string) => {
          return (
            <div className="d-flex order__status">
              {statusIcons[text] || text}
            </div>
          );
        },
        width: 50,
        align: "center",
      },
      {
        title: "АДРЕС",
        render: (text: any) => {
          return text.routes?.map(
            (item: any, index: number) =>
              `${item?.name} ${text.routes?.length - 1 !== index ? " -> " : ""}`
          );
          // return text.routes?.map((item: any, i: number) => {
          //   if (item?.address?.parent)
          //     return `${item?.address?.parent?.name} ${item?.address?.name} ${
          //       text.routes?.length - 1 === i ? "" : " -- "
          //     }`;
          //   return item?.name + " ";
          // });
        },
        width: 300,
      },
      {
        title: "EXECUTOR",
        dataIndex: "executor",
        render: (text: IExecutor) => {
          if (!text) return "";
          return (
            <div className="d-flex row-executor">
              <BxsWalletAlt style={{ color: "orange" }} />
              <div className="executor d-flex">
                <RacingController
                  style={{ color: "red" }}
                  className={"racing-controller"}
                />
                <b
                  className="order-ordinary-text fs-18"
                  style={{ marginLeft: 5 }}
                >
                  {text?.transport?.callsign}
                </b>
                <div
                  className="order-ordinary-text fs-12 "
                  style={{ marginLeft: 8 }}
                >
                  <b>
                    {text?.transport?.color?.name} {text?.transport?.model}
                  </b>
                  <b>
                    {stateNumberFormat(text?.transport?.state_number || "")}
                  </b>
                </div>
              </div>
            </div>
          );
        },
        width: 300,
      },
    ];
  }, []);
  const getById = useCallback((id: number) => {
    dispatch(setViewState(id));
    getData<{ [key: string]: any }>({ url: `/orders/${id}` });
  }, []);

  const table = useMemo(() => {
    return (
      <AntdTable
        columns={columns as any}
        pagination={false}
        dataSource={list}
        size="small"
        rowKey={(record: any) => record?.id + Math.random() * 100}
        onRow={(data: IExecutorList) => {
          return {
            onClick: () => {
              getById(data?.id);
            },
          };
        }}
        rowClassName={e => `${e?.id === id ? "ant-table-row-selected" : "row"}`}
      />
    );
  }, [list]);

  return table;
}
