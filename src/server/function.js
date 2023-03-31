import { message } from "antd";
import { useNavigate  } from "react-router-dom";
import { setStoreToken } from ".";
import { authUserButtonFalse, authUserReducers, authUserSplaceFalse } from "../redux/reduxer/auth";
import Api from "./api"

export const LoginFun =(data)=>(dispatch)=> {
    Api.login(data).then(res => {
        if(res.code === 200) {
            setStoreToken(res.result.access_token)
            dispatch(authUserReducers(res?.result?.user))
            dispatch(authUserButtonFalse())
            window.location.reload()
        }
    }).catch((err)=>{
        dispatch(authUserButtonFalse())
        dispatch(authUserSplaceFalse())
        localStorage.clear()
        message.error(err?.message)
    })
}
export const getMe =()=>(dispatch)=> {
    Api.me().then(res => {
        if(res.code === 200) {
            dispatch(authUserReducers(res?.result))
        }
    }).catch((err)=>{
        dispatch(authUserSplaceFalse())
        localStorage.clear()
    })
}