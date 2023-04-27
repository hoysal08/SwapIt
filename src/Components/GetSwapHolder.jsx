import React from 'react'
import GetSwap from '../utils/GetSwap'

function GetSwapHolder({props}) {     
     return(
        <div>{
        props.map((e,i)=><GetSwap key={i} props={e}/>)}
            </div>
     )
}

export default GetSwapHolder