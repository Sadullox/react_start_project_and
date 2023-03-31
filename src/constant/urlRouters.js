import { formatMessage } from "../language/language";
import { doshboard, employee, manager, offers } from "./path";
import {
    WindowsOutlined,
    UserOutlined,
    DatabaseOutlined,
    SolutionOutlined,
} from '@ant-design/icons';

export const urlRouters = [
    {
        path: doshboard,
        title:formatMessage("dashboard"),
        icon:<UserOutlined />,
        children:null
    },
    {
        path: offers,
        title:formatMessage("offers"),
        icon:<DatabaseOutlined />,
        children:null
    },
    {
        path: '',
        title:formatMessage("manager"),
        icon:<WindowsOutlined />,
        children:[
            {
                path: employee,
                title:formatMessage("employee"),
                icon:<SolutionOutlined />,
            }
        ]
    }
]