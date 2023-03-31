import "../styles/global.scss";
import { useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Button, Layout, Space, Dropdown, Avatar } from "antd";
import { Ru, Uz } from "../components/icons";
const { Header } = Layout;

const userHandleMenuClick = (e) => {
  localStorage.clear();
  window.location.reload()
};
const languageHandleMenuClick = (e) => {
  console.log("click", e);
};

const userItems = [
  {
    label: "Log out",
    key: "1",
    icon: <LogoutOutlined />,
  },
];
const userMenuProps = {
  items: userItems,
  onClick: userHandleMenuClick,
};

const languageItems = [
  {
    label: "UZ",
    key: "1",
    icon: <Uz />,
  },
  {
    label: "RU",
    key: "2",
    icon: <Ru />,
  },
];
const languageMenuProps = {
  items: languageItems,
  onClick: languageHandleMenuClick,
};

export const HeaderMenu = ({ setCollapsed, collapsed }) => {
    const navigate = useNavigate();
  return (
    <Header className="router_header">
      <Button type="text" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? (
          <MenuUnfoldOutlined style={{ color: "#fff" }} />
        ) : (
          <MenuFoldOutlined style={{ color: "#fff" }} />
        )}
      </Button>
      <Space>
        <Dropdown
          menu={languageMenuProps}
          placement="bottomRight"
          trigger={["click"]}
          className="dropdown"
        >
          <Avatar size={32} icon={<GlobalOutlined />} className="avatar" />
        </Dropdown>
        <Dropdown
          menu={userMenuProps}
          placement="bottomRight"
          trigger={["click"]}
          className="dropdown"
        >
          <Avatar size={32} icon={<UserOutlined />} className="avatar" />
        </Dropdown>
      </Space>
    </Header>
  );
};
