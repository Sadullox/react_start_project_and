import { Button, Result } from 'antd';

const PageNotFound = () => (
    <div style={{ position:"relative", top:0, left:0, zIndex:1111000 }}>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={<Button type="primary">Back Home</Button>}
        />
    </div>
);
export default PageNotFound