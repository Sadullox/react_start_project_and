import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { getMe } from './server/function';
import Fallbacklp from './components/fallbacklp';
import LoadingProvider from './myprovider/loading_provider';
const RouterAPP = React.lazy(() => import('./layout/routerAPP'))
const Login = React.lazy(() => import('./pages/login'))

function App() {
  const dispach = useDispatch()
  const access = useSelector(state => state.auth.access)

  useEffect(()=>{
    dispach(getMe())
  },[])

  return (
    <LoadingProvider>
      <Fallbacklp>
        {access?<RouterAPP />:<Login />}
      </Fallbacklp>
    </LoadingProvider>
  );
}

export default App;
