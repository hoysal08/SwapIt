import { useContractRead, useNetwork } from "wagmi";
import React, { useState } from 'react'
import { abi, swapaddressethtestnet } from "../Constants";
import { ethers } from "ethers";

function GetSwap(props) {
    props=props.props
    
    const [contractaddress, setcontractaddress] = useState(swapaddressethtestnet);
    const { chain } = useNetwork();

    const {data}=useContractRead({
        address:ethers.utils.getAddress(contractaddress),
        abi:abi,
        functionName:'swaps',
        args:[props],
        chainId:chain.id,
        enabled:Boolean(contractaddress),
        onSuccess(data) {
            console.log(data)
          },
      });
      
       return <h1>{JSON.stringify(data)}</h1>
}

export default GetSwap
