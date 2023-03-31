import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, FormInstance, Input, Select, Tag } from "antd";
import { formatMessage } from "language/Lang";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "stores/store";
import { debounce, isEmpty, isObject, omit, pick } from "lodash";
import {
  setAddress,
  setFrom,
  setSearchedAddress,
  setTo,
} from "stores/orderDetails";
import { MaterialSymbolsStarRounded, UilLocationPinAlt } from "assets/icons";
import { getData } from "functions/request";
import { addressSearch, availableRegions } from "constant/url";
import ModalAddress from "pages/order/details/modal/details/ModalAddress";
import axios, { CancelToken } from "axios";

const starAddress = {
  content: "a",
  color: "#fcba03",
};

let source: any = null;

function From({ fromRef }: { fromRef: any; form: FormInstance }) {
  const firstAddress = useSelector(
    (s: RootState) => s.orderDetails.firstAddress
  );
  const brand_id = useSelector((s: RootState) => s.orderDetails.brand_id);
  const [isAddressModal, setAddressModal] = useState(false);
  const from = useSelector(
    (s: RootState) => s.orderDetails.addressDetails.from
  );
  const fromValues = useSelector(
    (s: RootState) => s.orderDetails.addressDetails.fromValues
  );
  const toValues = useSelector(
    (s: RootState) => s.orderDetails.addressDetails.toValues
  );
  const searchedAddress = useSelector(
    (s: RootState) => s.orderDetails.addressDetails.searchedAddress
  );
  const dispatch = useDispatch();
  const option = useMemo(() => {
    if (isEmpty(fromValues)) {
      return firstAddress[brand_id]?.map((item, i) => (
        <Select.Option
          key={i}
          value={JSON.stringify({ ...item, address_id: item?.current_id })}
        >
          {item?.name}
        </Select.Option>
      ));
    } else if (fromValues.length <= 1) {
      return [...from, ...searchedAddress]?.map((item, i) => {
        const usedAddress = from?.find(
          address => address?.address?.id === item?.address?.id
        );
        return (
          <Select.Option
            key={i}
            value={JSON.stringify({
              ...item,
              address_id: isObject(item?.address)
                ? (item?.address as any)?.id
                : item?.current_id,
              usedAddress: !!usedAddress,
            })}
            className={"star__address"}
            style={usedAddress ? starAddress : {}}
          >
            {usedAddress && (
              <MaterialSymbolsStarRounded style={{ marginRight: 5 }} />
            )}
            {item?.name}
          </Select.Option>
        );
      });
    } else {
      return searchedAddress?.map((item, i) => {
        return (
          <Select.Option
            key={i}
            value={JSON.stringify(item)}
            className={"star__address"}
          >
            {item?.name}
          </Select.Option>
        );
      });
    }
  }, [fromValues, searchedAddress, from, firstAddress]);
  const leftTags = useMemo(() => {
    return (
      <>
        {fromValues.map((address, i) => {
          return <Tag key={i}>{address?.name}</Tag>;
        })}
      </>
    );
  }, [fromValues]);

  function change(e: string) {
    const parsed = JSON.parse(e);
    if (parsed?.usedAddress) {
      dispatch(setFrom(parsed?.parents));
      return;
    }
    dispatch(
      setFrom([...fromValues, { ...parsed, index: fromValues.length + 1 }])
    );
    dispatch(setSearchedAddress([]));

    if (toValues[0]?.children?.length <= 0) {
      dispatch(setTo([{ index: 1, children: [{ ...parsed, index: 1 }] }]));
    }
  }

  const keydownChange = useCallback(
    (code: string, value: string) => {
      if (code === "Backspace" && value.length < 1) {
        dispatch(setFrom([...fromValues].slice(0, fromValues.length - 1)));
        fromRef?.current?.focus();
      } else if (
        (code === "NumpadEnter" || code === "Enter") &&
        value.length > 1
      ) {
        const lastPosition = fromValues[fromValues.length - 1];
        dispatch(
          setFrom([
            ...fromValues,
            {
              name: value,
              address_id: lastPosition?.address_id || null,
              current_id: lastPosition?.current_id,
              lat: lastPosition?.lat,
              lng: lastPosition?.lng,
              level_id: null,
            },
          ])
        );
      }
    },
    [fromValues]
  );

  const onSearch = useCallback(
    (e: string) => {
      const id =
        fromValues[fromValues.length - 1]?.address_id ||
        fromValues[fromValues.length - 1]?.current_id;
      if (e === "" || !id) return;
      source?.cancel();
      source = axios.CancelToken.source();
      getData<{ [key: string]: any }[]>({
        url: `${addressSearch}/search?search=${e}&reg_id=${id}`,
        cancelToken: source?.token,
      }).then(res => {
        dispatch(setSearchedAddress(res.result || []));
      });
    },
    [fromValues]
  );

  useEffect(() => {
    if (!(brand_id in firstAddress)) {
      getData<any[]>({ url: `${availableRegions}&brand_id=${brand_id}` }).then(
        res => {
          dispatch(
            setAddress({
              [brand_id]:
                res.result?.map(item =>
                  pick(item, [
                    "current_id",
                    "level_id",
                    "lat",
                    "lng",
                    "id",
                    "name",
                    "parent",
                  ])
                ) || [],
            })
          );
        }
      );
    }
  }, [brand_id, firstAddress]);

  return (
    <div className={"order__address f-flex"}>
      <Form.Item label={formatMessage("from")} name={"from"}>
        <Input.Group compact>
          {leftTags}
          <Select
            transitionName={""}
            showSearch={true}
            showArrow={false}
            placeholder={formatMessage("e_address")}
            value={"Qayerdan"}
            onChange={change}
            onInputKeyDown={(e: any) =>
              keydownChange(e?.code, e?.target?.value)
            }
            showAction={["focus"]}
            ref={fromRef}
            onSearch={debounce(e => {
              if (fromValues.length >= 1) onSearch(e);
            }, 100)}
            className={"from__select"}
          >
            {option}
          </Select>
          <Button
            icon={<UilLocationPinAlt />}
            onClick={() => setAddressModal(true)}
          ></Button>
        </Input.Group>
      </Form.Item>
      {isAddressModal && (
        <ModalAddress
          open={isAddressModal}
          setOpen={() => setAddressModal(p => !p)}
          changeAddress={(address: any) => {
            if (!isEmpty(address)) {
              dispatch(
                setFrom(
                  address?.map(
                    (
                      item: {
                        current_id: number | null;
                        id: number | null;
                        lat: string;
                        lng: string;
                        name: string;
                      },
                      i: number
                    ) => ({
                      ...item,
                      address_id:
                        item?.current_id || address[i - 1]?.current_id,
                      level_id: null,
                    })
                  )
                )
              );
            }
          }}
        />
      )}
    </div>
  );
}

export default From;
