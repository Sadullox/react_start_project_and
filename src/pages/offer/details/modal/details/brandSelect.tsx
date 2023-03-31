import React, { useEffect, useMemo, useRef } from "react";
import { Form, FormInstance, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "stores/store";
import { storeNames } from "constant/constant";
import { prepareSelectOptions } from "functions/prepareSelectOptions";
import { formatMessage } from "language/Lang";
import { setBrandId } from "stores/orderDetails";

function BrandSelect({ form }: { form: FormInstance }) {
  const ref = useRef<any>(null);
  const isOpen = useSelector((s: RootState) => s.orderDetails.modal.isOpen);
  const dispatch = useDispatch();
  const brandOptions = useSelector(
    (s: RootState) => s.options.state?.[storeNames.availableBrands]
  );

  const brandOption = useMemo(() => {
    return brandOptions ? prepareSelectOptions(brandOptions) : [];
  }, [brandOptions]);

  useEffect(() => {
    if (ref.current && isOpen) ref.current?.focus();
  }, [isOpen]);

  return (
    <Form.Item name={"brand_id"} label={formatMessage("brand")}>
      <Select
        transitionName={""}
        placeholder={formatMessage("brand")}
        options={brandOption}
        ref={ref}
        showAction={["focus"]}
        id={"hello"}
        onChange={e => {
          dispatch(setBrandId(+e));
          form.setFieldValue("tariff_id", undefined);
        }}
      />
    </Form.Item>
  );
}

export default BrandSelect;
