import React, { useCallback } from "react";
import { Button, FormInstance, Space } from "antd";
import store, { RootState } from "stores/store";
import dayjs from "dayjs";
import { availableKeyBoardNames, DDMMYYYYWithTimes } from "constant/constant";
import { postData } from "functions/request";
import { taxiOrder, updateOrder } from "constant/url";
import { useDispatch, useSelector } from "react-redux";
import {
  clearOrder,
  clearOrderDetails,
  setModalOpen,
} from "stores/orderDetails";
import { findLast } from "lodash";

function prepareFrom(from: { [key: string]: any }[]) {
  const truthAddressId = findLast(from, a => a?.current_id || a?.address_id);
  return {
    index: 1,
    parents: from?.map((item, index) => ({ ...item, index: index + 1 })),
    address_id: truthAddressId?.current_id || truthAddressId?.address_id,
    lat: from[from.length - 1]?.lat,
    lng: from[from.length - 1]?.lng,
    level_id: from[from.length - 1]?.level_id || null,
    full_address: from?.map(item => item?.name).join(" "),
  };
}

function toPrepare(to: any[]): any[] {
  return to?.map((item, index) => {
    const address = findLast(
      item.children,
      a => a?.current_id || a?.address_id
    );
    return {
      index: index + 2,
      parents: item.children?.map((item: any, index: any) => ({
        ...item,
        index: index + 1,
      })),
      address_id: address?.address_id || address?.current_id,
      ...(() => {
        let full_address = "";
        const lastAddress = item?.children?.find(
          (point: { name: string }, index: number) => {
            full_address += point.name + " ";
            if (index === item?.children?.length - 1) return point;
          }
        );
        return {
          full_address,
          lat: lastAddress?.lat,
          lng: lastAddress?.lng,
        };
      })(),
    };
  });
}

function FooterBtns({ form }: { form: FormInstance }) {
  const dispatch = useDispatch();
  const from = useSelector(
    (s: RootState) => s.orderDetails.addressDetails.fromValues
  );
  const phone = useSelector(
    (s: RootState) => s.orderDetails.currentClient?.phone
  );
  const mode = useSelector((s: RootState) => s.orderDetails.mode);
  const currentOrder = useSelector(
    (s: RootState) => s.orderDetails.currentOrder
  );

  function submit() {
    const formValue = form.getFieldsValue();
    const orderValues = store.getState().orderDetails;
    try {
      const from = orderValues.addressDetails.fromValues;
      const to = orderValues.addressDetails.toValues;
      const values = {
        service: "taxi",
        counterparty: false,
        fixed_price: !orderValues.price.customPrice,
        payment_type: "cash",
        total_price: orderValues.price.customPrice || orderValues.price.cost,
        distance: orderValues.price.distance,
        duration: orderValues.price.duration,
        tariff_id: formValue.tariff_id,
        brand_id: +formValue.brand_id,
        comment: formValue.comment,
        tariff_options: orderValues.tariff.currentTariffIds,
        create_date: dayjs(formValue.birthday).format(DDMMYYYYWithTimes),
        addresses: [prepareFrom(from)].concat(
          to[0]?.children?.length > 0 ? toPrepare(to) : []
        ),
        address_id: from[0]?.address_id || from[0]?.current_id,
        client: {
          phone: orderValues.currentClient?.phone,
          sur_name: orderValues.currentClient?.sur_name || "",
          given_names: orderValues.currentClient?.given_names || "",
          client_address_id: orderValues.currentClient?.address_id || null,
        },
      };
      return postData<any, {}>({
        url: mode === "post" ? taxiOrder : `${taxiOrder}/${currentOrder?.id}`,
        type: mode === "post" ? "post" : "put",
        payload: values,
      });
    } catch (e) {
      return Promise.reject("");
    }
  }

  function clear() {
    if (mode === "update") {
      postData({
        url: `${updateOrder}/${currentOrder?.id}`,
        payload: { update_order: false, id: currentOrder?.id },
      });
    }
    form.resetFields();
    dispatch(clearOrderDetails());
    dispatch(clearOrder());
  }

  const Save = useCallback(() => {
    return (
      <Button
        type={"primary"}
        size={"large"}
        className={"save"}
        onClick={() => {
          submit().then(() => {
            clear();
            dispatch(setModalOpen(false));
          });
        }}
        disabled={!(from[1] && phone)}
        id={availableKeyBoardNames.save_order}
      >
        Saqlash
        <sup>F9</sup>
      </Button>
    );
  }, [from, phone]);

  const Duplicate = useCallback(() => {
    return (
      <Button
        type={"primary"}
        size={"large"}
        className={"save"}
        disabled={!(from[1] && phone)}
        onClick={submit}
        id={availableKeyBoardNames.duplicate_order}
      >
        Dublikat qilish
        <sup>INSERT</sup>
      </Button>
    );
  }, [from, phone]);

  const Clear = useCallback(() => {
    return (
      <Button
        size={"large"}
        className={"cancel"}
        onClick={() => {
          clear();
          dispatch(setModalOpen(false));
        }}
        id={availableKeyBoardNames.close}
      >
        Yopish
        <sup>END</sup>
      </Button>
    );
  }, []);

  return (
    <Space size={"middle"}>
      <Clear />
      <Duplicate />
      <Save />
    </Space>
  );
}

export default FooterBtns;
