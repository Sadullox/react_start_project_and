import { Form, FormInstance } from "antd";

import TariffSelect from "./details/tariffSelect";
import PhoneInput from "./details/phoneInput";
import BrandSelect from "./details/brandSelect";

interface IProps {
  form: FormInstance;
  fromRef: any;
}

const Item = Form.Item;

interface IClint {
  client_address_id: number | null;
  given_names: string | null;
  phone: string | null;
  sur_name: string | null;
}

export default function ModalAside(props: IProps) {
  const { form, fromRef } = props;

  return (
    <>
      <BrandSelect form={form} />
      <TariffSelect form={form} />
      <PhoneInput fromRef={fromRef} />
    </>
  );
}
// if they eat too much they get fat
// if i get out early from home i will go early office
// if you take medicine you might feel better soon

// if i were elon mask i would go to the mars
// if i were you i wouldn't use useState hook
// if i were you i would make add Function and this function able to two number add and return result
