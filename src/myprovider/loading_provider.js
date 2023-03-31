import React, {useState, useEffect} from 'react';
import Spinner from '../components/spinner';
import { useSelector} from 'react-redux'

const LoadingProvider = (props) => {
    const splash = useSelector(state => state.auth.splash)
    if(!splash){
      return(
          props.children
      )
    } else {
        return <Spinner />
    }
}

export default LoadingProvider;