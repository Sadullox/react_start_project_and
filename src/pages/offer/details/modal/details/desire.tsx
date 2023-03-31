import { Form, Select } from "antd";
import React, { useMemo } from "react";
import { formatMessage } from "language/Lang";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "stores/store";
import { currencyFormat } from "functions/formatters";
import { setCurrentTariffIds } from "stores/orderDetails";
import { isEmpty } from "lodash";

function Desire() {
  const tariffOptions = useSelector(
    (s: RootState) => s.orderDetails.tariff.currentTariff
  );
  const dispatch = useDispatch();

  const option = useMemo(() => {
    return tariffOptions?.options?.map((option: any, i: number) => (
      <Select.Option value={option?.id} key={i}>
        {option?.name} {currencyFormat(option?.cost || 0)}
      </Select.Option>
    ));
  }, [tariffOptions]);

  return (
    <Form.Item label={formatMessage("desires")} name={"desires"}>
      <Select
        mode="multiple"
        allowClear
        style={{ width: "100%" }}
        placeholder={formatMessage("desires")}
        onChange={e => dispatch(setCurrentTariffIds(e))}
        disabled={isEmpty(tariffOptions?.options)}
        transitionName={""}
      >
        {option}
      </Select>
    </Form.Item>
  );
}

export default Desire;
