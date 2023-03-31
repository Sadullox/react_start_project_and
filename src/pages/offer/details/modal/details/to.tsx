import React, { useCallback, useMemo, useState } from "react";
import { formatMessage } from "language/Lang";
import { Button, Form, Input, Select, Tag } from "antd";
import { debounce, isEmpty, isObject } from "lodash";
import { MaterialSymbolsStarRounded, UilLocationPinAlt } from "assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "stores/store";
import { setSearchedAddress, setTo } from "stores/orderDetails";
import { getData } from "functions/request";
import { addressSearch } from "constant/url";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import ModalAddress from "pages/order/details/modal/details/ModalAddress";

const starAddress = {
  content: "a",
  color: "#fcba03",
};

function To() {
  const firstAddress = useSelector(
    (s: RootState) => s.orderDetails.firstAddress
  );
  const brand_id = useSelector((s: RootState) => s.orderDetails.brand_id);
  const toValues = useSelector(
    (s: RootState) => s.orderDetails.addressDetails.toValues
  );
  const to = useSelector((s: RootState) => s.orderDetails.addressDetails.to);
  const searchedAddress = useSelector(
    (s: RootState) => s.orderDetails.addressDetails.searchedAddress
  );
  const [isAddressModal, setAddressModal] = useState(false);
  const [currentAddressIndex, setCurrentAddressIndex] = useState<number | null>(
    null
  );
  const dispatch = useDispatch();

  const option = useCallback(
    (item: any) => {
      if (isEmpty(item.children)) {
        return firstAddress?.[brand_id]?.map((item, i) => (
          <Select.Option
            key={i}
            value={JSON.stringify({ ...item, address_id: item?.current_id })}
          >
            {item?.name}
          </Select.Option>
        ));
      } else if (item.children.length <= 1) {
        return [...to, ...searchedAddress]?.map((item, i) => {
          const usedAddress = to?.find(
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
              {usedAddress && <MaterialSymbolsStarRounded />}
              {item?.name}
            </Select.Option>
          );
        });
      } else {
        return searchedAddress?.map((item, i) => (
          <Select.Option
            key={i}
            value={JSON.stringify({ ...item, address_id: item?.current_id })}
            className={"star__address"}
          >
            {item?.name}
          </Select.Option>
        ));
      }
    },
    [toValues, searchedAddress, to, firstAddress]
  );

  const RowTags = useCallback(
    (props: { tag: { name: string }[] }) => {
      return (
        <>
          {props?.tag?.map((item, i) => (
            <Tag key={i}>{item?.name}</Tag>
          ))}
        </>
      );
    },
    [toValues]
  );

  const keydownChange = useCallback(
    (code: string, index: number, value: string) => {
      if (code === "Backspace" && value.length < 1 && index) {
        const clonedValues = toValues?.map(item => {
          if (item.index === index) {
            item = {
              ...item,
              children: [...item.children].splice(0, item.children.length - 1),
            };
          }
          return item;
        });
        dispatch(setTo(clonedValues));
      }
    },
    [toValues]
  );

  const onSearch = useCallback((e: string, item: any) => {
    if (e === "") return;
    getData<{ [key: string]: any }[]>({
      url: `${addressSearch}/search?search=${e}&reg_id=${
        item?.[item.length - 1]?.id || item?.[item.length - 1]?.address_id
      }`,
    }).then(res => {
      dispatch(setSearchedAddress(res.result || []));
    });
  }, []);

  const change = useCallback(
    (e: string, id: number) => {
      const parsed = JSON.parse(e);
      if (parsed?.usedAddress) {
        dispatch(setSearchedAddress([]));
        const clonedValues = toValues?.map(item => {
          if (item.index !== id) return item;
          return {
            ...item,
            children: parsed?.parents,
          };
        });
        dispatch(setTo(clonedValues));
        return;
      }
      dispatch(setSearchedAddress([]));
      const clonedValues = toValues?.map(item => {
        if (item.index !== id) return item;
        return {
          ...item,
          children: [
            ...item.children,
            { ...parsed, index: item.children.length + 1 },
          ],
        };
      });
      dispatch(setTo(clonedValues));
    },
    [toValues]
  );

  const inputs = useMemo(() => {
    return toValues?.map((item, i) => {
      return (
        <Input.Group compact key={i} style={{ marginTop: i !== 0 ? "5px" : 0 }}>
          <RowTags tag={item.children} />
          <Select
            transitionName={""}
            showSearch={true}
            showArrow={false}
            placeholder={formatMessage("e_address")}
            value={toValues.length - 1 === i ? "Qayerga" : "Bekat"}
            onChange={(e: string) => change(e, i + 1)}
            onInputKeyDown={(e: any) =>
              keydownChange(e?.code, item?.index, e?.target?.value)
            }
            showAction={["focus"]}
            onSearch={debounce(e => {
              if (item?.children.length >= 1) onSearch(e, item.children);
            }, 200)}
            className={"from__select"}
          >
            {option(item)}
          </Select>
          {i !== 0 && (
            <Button
              icon={<MinusOutlined />}
              onClick={() => dispatch(setTo(toValues.slice(0, i)))}
            ></Button>
          )}
          {item.children?.length > 0 && (
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                dispatch(
                  setTo([
                    ...toValues,
                    { index: toValues.length + 1, children: [] },
                  ])
                );
              }}
            ></Button>
          )}
          <Button
            icon={<UilLocationPinAlt />}
            onClick={() => {
              setCurrentAddressIndex(i);
              setAddressModal(true);
            }}
          ></Button>
        </Input.Group>
      );
    });
  }, [toValues, option]);

  return (
    <div className={"order__address"}>
      <Form.Item label={formatMessage("where_to")}>
        <>{inputs}</>
      </Form.Item>
      {isAddressModal && (
        <ModalAddress
          open={isAddressModal}
          setOpen={() => setAddressModal(p => !p)}
          changeAddress={(address: any) => {
            if (!isEmpty(address) && currentAddressIndex !== null) {
              console.log(address);
              dispatch(
                setTo(
                  toValues.map((item, i) =>
                    i === currentAddressIndex
                      ? {
                          index: item?.index,
                          children: address.map((item: any) => ({
                            ...item,
                            address_id: 5,
                            level_id: null,
                          })),
                        }
                      : item
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

export default To;
