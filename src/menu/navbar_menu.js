import React, { useState } from 'react';
import { Layout, } from 'antd';
import {Outlet} from 'react-router-dom';
import "./../styles/routers.scss"
import { SiderMenu } from './sider_menu';
import { HeaderMenu } from './header_menu';

const { Header, Content } = Layout;
const NavbarMenu = () => {
    const [collapsed, setCollapsed] = useState(true);
    return (
        <Layout className='golbal_router'>
        <SiderMenu collapsed={collapsed} />
        <Layout className="site-layout">
                <HeaderMenu setCollapsed={setCollapsed} collapsed={collapsed} />
                <Content className='layout_content'>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
  }
  export default NavbarMenu