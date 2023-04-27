import { Box, Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import NoNfts from '../Components/NoNfts'
import { useContractRead, useNetwork, useSigner } from 'wagmi';
import { abi, swapaddressethtestnet, swapaddresspolytestnet } from '../Constants';
import { ethers } from 'ethers';
import GetSwap from '../utils/GetSwap';
import GetSwapHolder from '../Components/GetSwapHolder';

function Discover() {


  const { chain } = useNetwork();
  const { signer } = useSigner();

  const [contractaddress, setcontractaddress] = useState(swapaddressethtestnet);
  const[totalswaps,settotalswaps] = useState(10);
  const[swapIndexarr,setswapindexarr] = useState([])
  const [NFTdata,setNftdata]=useState();
  const [regroupednft,setregroupednft]=useState([]);


  function getcontractaddress() {
    if (chain.id === 11155111) {
      setcontractaddress(ethers.utils.getAddress(swapaddressethtestnet));
    }
    if (chain.id === 80001) {
      setcontractaddress(ethers.utils.getAddress(swapaddresspolytestnet));
    }
  }

  function formatcontractaddress(addr) {
    return (
      addr.substring(0, 4) +
      "...." +
     addr.slice(-4)
    );
  }

  useEffect(() => {
    getcontractaddress();
  }, [chain]);


  // const {data}=useContractRead({
  //   address:ethers.utils.getAddress(contractaddress),
  //   abi:abi,
  //   functionName:'swapCount',
  //   chainId:chain.id,
  //   enabled:Boolean(contractaddress),
  //   onSuccess(data) {
  //       settotalswaps(data.toNumber())
  //     },
  // });

  const groupnftdata=()=>{
    let group = [];
    const n=3;
    for (let i = 0, j = 0; i < swapIndexarr?.length; i++) {
        if (i >= n && i % n === 0)
            j++;
        group[j] = group[j] || [];
        group[j].push(swapIndexarr[i])
    }
    setregroupednft(group)
}
 

  useEffect(()=>{
    setswapindexarr(Array.from(Array(totalswaps).keys()))
  },[totalswaps])


  useEffect(()=>{
    groupnftdata()
  },[swapIndexarr])

  useEffect(()=>{
  },[regroupednft])

  return (
    <div >
    <Box backgroundColor="#ECC9EE" pt="3%" h={"100%"}>
      <Flex direction="column">
        {
          
          (<NoNfts/>)
        }

        {
          regroupednft && regroupednft.map((e,i)=><GetSwapHolder key={i} props={e}/>)
        }
           
    </Flex>  
    </Box>
    
    </div>
  )
}

export default Discover