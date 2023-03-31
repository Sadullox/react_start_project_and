import React, { useEffect, useMemo, useRef } from "react";
import { Form, FormInstance, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "stores/store";
import { storeNames } from "constant/constant";
import { getData } from "functions/request";
import { formatMessage } from "language/Lang";
import { setSelectOption } from "stores/selectOptions";
import { setCurrentTariff } from "stores/orderDetails";

function TariffSelect({ form }: { form: FormInstance }) {
  const ref = useRef<any>(null);
  const tariff = useSelector(
    (s: RootState) => s.options.state?.[storeNames.availableTariffs]
  );
  const tariffOptions = useSelector(
    (s: RootState) => s.orderDetails.tariff.currentTariff
  );
  const brand_id = useSelector((s: RootState) => s.orderDetails.brand_id);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!tariff) {
      getData<{ [key: string]: number | string }[]>({
        url: "/list/taxi/tariffs",
      }).then(res => {
        dispatch(
          setSelectOption({
            name: storeNames.availableTariffs,
            value: res.result || [],
          })
        );
      });
    }
  }, []);
  const option = useMemo(() => {
    return tariff
      ?.filter(item => item.brand_id === brand_id)
      ?.map((tariff, i) => (
        <Select.Option key={i} value={tariff?.id}>
          {tariff?.name}
        </Select.Option>
      ));
  }, [tariff, brand_id]);

  useEffect(() => {
    if (tariff) {
      const currentTariff = tariff?.find(
        item => item?.id === form.getFieldValue("tariff_id")
      );
      if (currentTariff) dispatch(setCurrentTariff(currentTariff || null));
    }
  }, [tariff, tariffOptions]);
  return (
    <Form.Item name={"tariff_id"} label={formatMessage("tariff")}>
      <Select
        autoFocus
        transitionName={""}
        placeholder={formatMessage("tariff")}
        ref={ref}
        showAction={["focus"]}
        onChange={e => {
          const currentTariff = tariff?.find(item => item?.id === e);
          if (currentTariff) dispatch(setCurrentTariff(currentTariff || null));
        }}
      >
        {option}
      </Select>
    </Form.Item>
  );
}

// ant-select-open
export default TariffSelect;
