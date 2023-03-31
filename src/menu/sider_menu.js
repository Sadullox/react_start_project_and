import React, { memo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from 'antd';
import { urlRouters } from '../constant/urlRouters';
const { Sider } = Layout;

function MenuLink (props){
    if(props.path){
        return (
            <Link to={props.path}>
                {props.title}
            </Link>
        )
    }
    return props.title
}

function MenuLinkChildren (props){
    if(props?.children){
        return props?.children?.map((v, i) => {
            const subKey = props.index*(i+1);
            return {
              key: subKey,
              label: MenuLink(v),
            };
        })
    }
    return null
}
const items = urlRouters.map((item, index)=>{
    return {
        key: index,
        icon: item.icon,
        label: MenuLink(item),
        children: MenuLinkChildren(item),
    }
})

export const SiderMenu = ({ collapsed }) => {
    return (
        <Sider className={collapsed? 'router_sider active':'router_sider'}  trigger={null} collapsed={collapsed}>
            <div className="router_logo"> Bla Bla Taxi </div>
            <Menu
                className='sider_menu'
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['0']}
                items={items}
            />
        </Sider>
    )
}
