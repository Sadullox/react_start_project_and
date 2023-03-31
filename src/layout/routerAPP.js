
import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import "./../styles/routers.scss"
import Offer from '../pages/offer/offer';
import PageNotFound from '../pages/error/404';
import PrivateRoute from '../myprovider/private_route';
import Login from '../pages/login';
import { Layout } from 'antd';
import NavbarMenu from '../menu/navbar_menu';

const Dashboard = React.lazy(() => import('../pages/dashboard'))
const { Header, Content } = Layout;

const RouterAPP = () => {
    return (
        <Fragment>
            <Routes>
                <Route exact path='/' element={<NavbarMenu />}>
                    <Route exact path='/' element={<Dashboard />} />
                    <Route exact path='/offers' element={<Offer />} />
                </Route>
                {/* <Route exact path='/login' element={<Login />} /> */}
                <Route exact path='*' element={<PageNotFound />} />
            </Routes>
        </Fragment>
    )
};

export default RouterAPP;

