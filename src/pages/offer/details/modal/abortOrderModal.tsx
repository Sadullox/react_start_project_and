import { Form, Modal } from "antd";
import Input from "components/modal/tags/Input";
import Select from "components/modal/tags/Select";
import { orderStatus } from "constant/constant";
import { orders } from "constant/url";
import { postData } from "functions/request";
import { formatMessage } from "language/Lang";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAbortModalOpen } from "stores/orderDetails";
import { RootState } from "stores/store";

export default function AbortOrderModal() {
  const isOpen = useSelector((s: RootState) => s.orderDetails.isAbortModalOpen);
  const id = useSelector((s: RootState) => s.view.state.currentView?.id);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  function submit() {
    if (id) {
      setLoading(true);
      const { reason_id, comment } = form.getFieldsValue();
      postData({
        url: `${orders}/${id}`,
        payload: {
          id,
          status: orderStatus.canceled,
          comment,
          reason_id: +reason_id,
        },
        type: "put",
      })
        .then(() => {
          form.resetFields();
          dispatch(setAbortModalOpen(false));
        })
        .finally(() => setLoading(false));
    }
  }

  return (
    <Modal
      open={isOpen}
      onCancel={() => dispatch(setAbortModalOpen(false))}
      title={formatMessage("abort_reason")}
      wrapClassName={"modal"}
      onOk={submit}
      okButtonProps={{ loading: loading }}
      maskTransitionName=""
      transitionName=""
    >
      <Form form={form} initialValues={{ reason: "1" }}>
        <Select
          form={form}
          name={"reason_id"}
          rules={[{ require: true, message: "Kirit" }]}
          placeholder={formatMessage("reason")}
          storeName={"abortreason"}
          url={"/reason"}
          autoFocus={true}
        />
        <Input name={"comment"} placeholder={formatMessage("comment")} />
      </Form>
    </Modal>
  );
}
