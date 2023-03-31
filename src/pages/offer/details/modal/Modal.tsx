import { Col, Form, Modal as AntdModal, Row } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "stores/store";
import ModalAddresses from "./modalAddresses";
import { lazy, Suspense, useEffect, useMemo, useRef } from "react";
import dayjs from "dayjs";
import Price from "pages/order/details/modal/details/price";
import FooterBtns from "pages/order/details/modal/details/footerBtns";
import "./style.scss";

const ModalAside = lazy(() => import("./modalAside"));
export default function Modal() {
  const isOpen = useSelector((s: RootState) => s.orderDetails.modal.isOpen);
  const currentOrder = useSelector(
    (s: RootState) => s.orderDetails.currentOrder
  );
  const mode = useSelector((s: RootState) => s.orderDetails.mode);
  const [form] = Form.useForm();
  const fromRef = useRef();
  useEffect(() => {
    return () => {
      if (isOpen) form.resetFields();
    };
  }, [isOpen]);

  const aside = useMemo(() => {
    return <ModalAside form={form} fromRef={fromRef} />;
  }, [fromRef]);

  useEffect(() => {
    if (mode === "update") {
      form.setFieldsValue({
        brand_id: currentOrder?.brand?.id?.toString(),
        tariff_id: currentOrder?.taxi?.tariff_id,
        create_date: dayjs(currentOrder?.create_date),
        phone: currentOrder?.client?.phone?.slice(4, 13),
        desires: currentOrder?.taxi?.tariff_options?.map(
          (item: any) => item?.id
        ),
        comment: currentOrder?.comment,
      });
    }
  }, [mode]);

  return (
    <AntdModal
      open={isOpen}
      width={1103}
      className={"order__modal"}
      transitionName=""
      maskTransitionName=""
    >
      <section className="order__info" style={{ zIndex: 999999 }}>
        <Form
          style={{ width: "100%" }}
          form={form}
          layout={"vertical"}
          initialValues={{
            brand_id: "1",
            service: "taxi",
            tariff_id: 2,
            create_date: dayjs(),
          }}
        >
          <Row style={{ height: "100%" }}>
            <Col span={6} className={"order__info_aside"}>
              {isOpen && <Suspense fallback={""}>{aside}</Suspense>}
            </Col>
            <Col span={18} className={"order__info_addresses"}>
              <ModalAddresses fromRef={fromRef} form={form} />
            </Col>
          </Row>
        </Form>
      </section>
      <section className={"order__footer"}>
        <Price form={form} />
      </section>
      <section className={"order__footer_btns"}>
        <FooterBtns form={form} />
      </section>
    </AntdModal>
  );
}
