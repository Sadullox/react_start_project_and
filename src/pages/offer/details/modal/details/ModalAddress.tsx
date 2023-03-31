import React, { useEffect, useMemo, useState } from "react";
import Modal from "components/modal/Modal";
import Map from "components/map/Map";
import { getData } from "functions/request";
import { findExecutorForMap } from "constant/url";
import { message } from "antd";

type responseType = {
  address: any[];
  executors: any[];
  map_address: string;
};

function ModalAddress({
  open,
  setOpen,
  changeAddress,
}: {
  open: boolean;
  setOpen: () => void;
  changeAddress: (a: any) => void;
}) {
  const [centerPosition, setCenterPosition] = useState<[number, number] | null>(
    null
  );
  const [response, setResponse] = useState<responseType | null>(null);

  useEffect(() => {
    if (centerPosition) {
      getData<responseType>({
        url: `${findExecutorForMap}?lat=${centerPosition[0]}&lng=${centerPosition[1]}`,
      }).then(res => {
        if (res.result) {
          setResponse(res.result);
          message?.[
            res.result?.map_address === "not found" ? "error" : "success"
          ](res.result?.map_address || "Success");
        }
      });
    }
  }, [centerPosition]);

  const map = useMemo(() => {
    return <Map changeCenter={center => setCenterPosition(center)} />;
  }, []);
  const fullName = useMemo(() => {
    return response?.address?.map(item => item?.name + " ");
  }, [response?.address]);

  useEffect(() => {
    return () => setResponse(null);
  }, []);
  return (
    <Modal
      open={open}
      onCancel={setOpen}
      title={fullName || ""}
      width={1000}
      // className={"address_map"}
      transitionName={""}
      maskTransitionName={""}
      onOk={() => {
        changeAddress(response?.address);
        setOpen();
      }}
    >
      {map}
    </Modal>
  );
}

export default ModalAddress;
