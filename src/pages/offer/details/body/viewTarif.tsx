import { Collapse, Descriptions, Spin } from "antd";
import { MdiDatabase } from "assets/icons";
import { orderTariff } from "constant/url";
import { currencyFormat } from "functions/formatters";
import { getData } from "functions/request";
import { formatMessage } from "language/Lang";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "stores/store";

export default function ViewTarif() {
  const [tariffs, setTariffs] = useState<{
    [key: string]: { [key: string]: any };
  }>({});
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentView = useSelector((s: RootState) => s.view.state.currentView);

  useEffect(() => {
    if (currentView?.id && isActive) {
      change();
    }
  }, [currentView?.id]);
  function change() {
    if (
      !tariffs?.hasOwnProperty(currentView?.taxi?.tariff_id) &&
      currentView?.id
    ) {
      setIsLoading(true);
      getData<{ tariff: { [key: string]: any } }>({
        url: `${orderTariff}/${currentView?.id}`,
      })
        .then(res => {
          setTariffs(p => ({
            ...p,
            [res?.result?.tariff?.id]: res?.result?.tariff,
          }));
        })
        .finally(() => setIsLoading(false));
    }
  }

  const collapseContent = useMemo(() => {
    return (
      <div className="collapse__body">
        <Descriptions title={formatMessage("city")} column={3}>
          <Descriptions.Item label={formatMessage("cost_of_km")}>
            {currencyFormat(
              tariffs?.[currentView?.taxi?.tariff_id]?.city_km_cost || 0
            )}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage("min_city_cost")}>
            {currencyFormat(
              tariffs?.[currentView?.taxi?.tariff_id]?.min_city_cost || 0
            )}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage("min_wait_time_cost")}>
            {currencyFormat(
              tariffs?.[currentView?.taxi?.tariff_id]?.city_min_cost || 0
            )}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title={formatMessage("out_of_city")}>
          <Descriptions.Item label={formatMessage("cost_of_km")}>
            {currencyFormat(
              tariffs?.[currentView?.taxi?.tariff_id]?.out_city_km_cost || 0
            )}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage("min_city_cost")}>
            {currencyFormat(
              tariffs?.[currentView?.taxi?.tariff_id]?.min_out_city_cost || 0
            )}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage("min_wait_time_cost")}>
            {currencyFormat(
              tariffs?.[currentView?.taxi?.tariff_id]?.out_city_min_cost || 0
            )}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  }, [tariffs]);

  return (
    <Collapse
      expandIconPosition={"end"}
      className={"content main-content"}
      onChange={e => {
        setIsActive(!!e[0]);
        if (e[0]) {
          change();
        }
      }}
    >
      <Collapse.Panel
        header={
          <div className="collapse-header d-flex">
            <MdiDatabase className="svg" />
            <span>
              {currentView?.taxi?.tariff_name} {currentView?.address?.name}
            </span>
          </div>
        }
        key="1"
      >
        <Spin spinning={isLoading}>{collapseContent}</Spin>
      </Collapse.Panel>
    </Collapse>
  );
}
// city_km_cost: 1300;
// city_min_cost: 0;
// free_waiting_time: 3;
// id: 1;
// included_km: 0.2;
// min_city_cost: 4000;
// min_out_city_cost: 4000;
// name: "Start";
// out_city_km_cost: 1700;
// out_city_min_cost: 0;
// waiting_minute_cost: 400;
