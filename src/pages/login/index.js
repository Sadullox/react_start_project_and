import "../../styles/login.scss";
import { Button, Form, Input, message, Typography, Layout } from "antd";
import FormatMessage, { formatMessage } from "../../language/language";
import { useSelector, useDispatch } from 'react-redux'
import { LoginFun } from "../../server/function";
import { authUserButtonTrue } from "../../redux/reduxer/auth";
const { Title } = Typography;


const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const loading = useSelector(state => state.auth.loading)
  
// console.log(state.auth);
  const onFinish = () => {
    form.validateFields()
    .then(res => {
      dispatch(authUserButtonTrue())
      dispatch(LoginFun(res))
    })
    .catch(err =>{
      console.log(err);
    })
  };

  return (
    <Layout className="login">
      <div className="login-container">
        <Title level={3} style={{ textAlign: "center" }}>
          <FormatMessage id="loginTitle" />
        </Title>
        <br />
        <Form form={form} onFinish={onFinish} size="large">
          <Form.Item
            name="login"
            rules={[
              {
                required: true,
                message: formatMessage("login_e"),
              },
            ]}
          >
            <Input
              type="text"
              autoComplete="off"
              placeholder={formatMessage("login")}
            />
          </Form.Item>

          <Form.Item
            name="password"
            autoComplete="off"
            rules={[
              {
                required: true,
                message: formatMessage("password_e"),
              },
            ]}
          >
            <Input.Password
              id="login_password"
              placeholder={formatMessage("password")}
            />
          </Form.Item>
          <Form.Item>
            <Button
             disabled={loading}
              type="primary"
              htmlType="submit"
              block
              style={{ height: "40px" }}
            >
              <FormatMessage id="enter" />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  )
};
export default Login;
