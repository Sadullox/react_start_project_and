import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import NavbarMenu from '../menu/navbar_menu';
import { useSelector} from 'react-redux'

const PrivateRoute = () => {
    const access = useSelector(state => state.auth.access)
    return access ?<NavbarMenu />: <Navigate to="/login" />;
}
export default PrivateRoute