import React, { useEffect, useMemo, useState } from "react";
import { Button, FormInstance, InputNumber, Typography } from "antd";
import { Edit } from "assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "stores/store";
import { flattenDeep } from "lodash";
import { postData } from "functions/request";
import { orderPrice } from "constant/url";
import { IOrderPrice } from "types/response";
import { setPrice } from "stores/orderDetails";
import { currencyFormat } from "functions/formatters";
import { formatToSum, parserFromSum } from "functions/functions";

const { Text, Title } = Typography;

function Price({ form }: { form: FormInstance }) {
  const dispatch = useDispatch();
  const [isCustomPrice, setIsCustomPrice] = useState(false);
  const from = useSelector(
    (s: RootState) => s.orderDetails.addressDetails.fromValues
  );
  const to = useSelector(
    (s: RootState) => s.orderDetails.addressDetails.toValues
  );
  const option = useSelector(
    (s: RootState) => s.orderDetails.tariff.currentTariffIds
  );
  const tariff = useSelector(
    (s: RootState) => s.orderDetails.tariff.currentTariff
  );
  const prices = useSelector((s: RootState) => s.orderDetails.price);
  const price = useMemo(() => {
    return (
      <div className={"price__block"}>
        <Text type="secondary" strong>
          Summa
        </Text>
        <div style={{ display: "flex", alignItems: "center" }}>
          {isCustomPrice && (
            <InputNumber
              style={{ width: 200, fontWeight: 500, fontSize: "18px" }}
              onBlur={() => setIsCustomPrice(false)}
              formatter={formatToSum}
              parser={parserFromSum}
              onPressEnter={(e: any) => {
                dispatch(
                  setPrice({
                    ...prices,
                    customPrice: +e?.target?.value?.split(",").join(""),
                  })
                );
                setIsCustomPrice(false);
              }}
              autoFocus
            />
          )}
          {!isCustomPrice && (
            <Title
              level={2}
              style={{ margin: 0, color: "#d1c025", fontWeight: 500 }}
              color={"#d1c025"}
            >
              {prices.customPrice || prices.cost
                ? `${currencyFormat(prices.customPrice || prices.cost)} So'm`
                : "Оплата по факту"}
            </Title>
          )}
          <Button
            type={"primary"}
            style={{ marginLeft: 15, padding: "5px 7px" }}
            onClick={() => setIsCustomPrice(true)}
          >
            <Edit fill={"#fff"} />
            <sup>F6</sup>
          </Button>
        </div>
      </div>
    );
  }, [prices, isCustomPrice]);

  useEffect(() => {
    if (from?.length > 1 && to[0]?.children?.length >= 1) {
      try {
        const fromPoint = from
          .slice(1, from.length)
          .map(item => ({ lat: item?.lat, lng: item?.lng }));
        const toPoint = to.map(item => {
          return item?.children?.length > 1
            ? item?.children
                ?.slice(1, item.length)
                .map((point: { lat: string; lng: string }) => ({
                  lat: point?.lat,
                  lng: point?.lng,
                }))
            : [{ lat: item?.children[0]?.lat, lng: item?.children[0]?.lng }];
        });
        postData<any, IOrderPrice>({
          url: orderPrice,
          payload: {
            option_ids: option,
            point: [...fromPoint, ...flattenDeep(toPoint)],
            tariff_id: form.getFieldValue("tariff_id"),
          },
        }).then(res => {
          if (res.result) dispatch(setPrice(res.result));
        });
      } catch (e) {}
    }
  }, [from, to, option, tariff]);

  return price;
}

export default Price;
