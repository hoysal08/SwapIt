import { Box } from '@chakra-ui/react'
import { getContractAddress } from 'ethers/lib/utils.js';
import React, { useEffect, useState } from 'react'
import { useAccount, useContractRead, useNetwork } from 'wagmi';
import { abi, swapaddressethtestnet, swapaddresspolytestnet } from '../Constants';
import { ethers } from 'ethers';

function Swaps() {

  const { chain } = useNetwork();
  const {address}=useAccount()

  const[correctcntaddres,setcorrectcntaddres]=useState(false);
  const [contractaddress, setcontractaddress] = useState(swapaddressethtestnet);
  const [openswapcount, setopenswapcount]=useState(0);


  const {data}=useContractRead({
    address:ethers.utils.getAddress(contractaddress),
    abi:abi,
    functionName:'userSwapCount',
    chainId:chain?.id,
    args:[address],
    enabled:Boolean(correctcntaddres),
    onSuccess(data) {
      setopenswapcount(data.toNumber())
      },
  });


  const {useropenswaps}=useContractRead({
    address:ethers.utils.getAddress(contractaddress),
    abi:abi,
    functionName:'userSwaps',
    chainId:chain?.id,
    args:[address,0],
    enabled:Boolean(correctcntaddres),
    onSuccess(useropenswaps) {
      console.log(useropenswaps)
      },
      onError(err){
        console.log(err)
      }
  });
  


  function getcontractaddress() {
    if (chain?.id === 11155111) {
      setcontractaddress(ethers.utils.getAddress(swapaddressethtestnet));
    }
    if (chain?.id === 80001) {
      setcontractaddress(ethers.utils.getAddress(swapaddresspolytestnet));
    }
    setcorrectcntaddres(true)
  }

  useEffect(()=>{
    getcontractaddress()
  },[])

  return (
    <div>
      <Box backgroundColor="#ECC9EE" h="100vh">
  
     </Box>
  </div>
  )
}

export default Swaps