import React, { Suspense } from 'react';
import Spinner from './spinner';

const Fallbacklp = (props) => {
    return (
        <Suspense fallback={<Spinner />}>
            {props.children}
        </Suspense>
    )
}
export default Fallbacklp