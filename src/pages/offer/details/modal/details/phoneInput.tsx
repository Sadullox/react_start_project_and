import React, { useCallback, useEffect, useState } from "react";
import { Form, Input } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { isArray, isEmpty } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "functions/request";
import { RootState } from "stores/store";
import { clientSearch } from "constant/url";
import { formatMessage } from "language/Lang";
import {
  setClientAddress,
  setCurrentClient as setClient,
} from "stores/orderDetails";

function PhoneInput({ fromRef }: { fromRef: any }) {
  const currentClient = useSelector(
    (s: RootState) => s.orderDetails.currentClient
  );
  const dispatch = useDispatch();

  const getUser = useCallback((value: string) => {
    postData<{ phone: string }, { address_id: number } | []>({
      url: clientSearch,
      payload: {
        phone: value,
      },
    }).then(res => {
      if (isArray(res.result)) {
        dispatch(
          setClient({
            phone: `+998${value}`,
            id: 0,
            sur_name: "",
            given_names: "",
            address_id: 0,
            block: false,
            block_note: "",
          })
        );
        dispatch(
          setClientAddress({
            from: [],
            to: [],
          })
        );
        return;
      } else {
        dispatch(setClient(res.result as any));
        postData<any, { from: []; to: [] }>({
          url: clientSearch,
          payload: {
            phone: value,
            address: true,
          },
        }).then(res => {
          fromRef?.current?.focus();
          dispatch(
            setClientAddress({
              from: res.result?.from || [],
              to: res.result?.to || [],
            })
          );
        });
      }
    });
  }, []);
  return (
    <>
      <Form.Item
        name={"phone"}
        label={formatMessage("phone")}
        rules={[
          {
            pattern: /^[\d]{9}$/,
            message: formatMessage("phone_number_validate"),
          },
        ]}
        style={{ marginBottom: 0 }}
      >
        <Input
          placeholder={"911275353"}
          autoComplete="off"
          addonBefore="+998"
          addonAfter={
            currentClient && <EditOutlined style={{ cursor: "pointer" }} />
          }
          maxLength={9}
          onChange={e => {
            const value = e.target.value;
            if (value.length >= 9) getUser(value);
            if (
              value.length < 9 &&
              !isEmpty(currentClient) &&
              currentClient?.phone
            )
              dispatch(setClient(null));
          }}
          style={{ fontSize: "30px" }}
        />
      </Form.Item>
      {!isEmpty(currentClient) && (
        <span>
          {currentClient?.given_names} {currentClient?.sur_name}
        </span>
      )}
    </>
  );
}

export default PhoneInput;
