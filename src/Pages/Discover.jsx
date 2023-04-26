import { Box, Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import NoNfts from '../Components/NoNfts'
import { useContractRead, useNetwork, useSigner } from 'wagmi';
import { abi, swapaddressethtestnet, swapaddresspolytestnet } from '../Constants';
import { ethers } from 'ethers';
import GetSwap from '../utils/GetSwap';

function Discover() {


  const { chain } = useNetwork();
  const { signer } = useSigner();

  const [contractaddress, setcontractaddress] = useState(swapaddressethtestnet);
  const[totalswaps,settotalswaps] = useState();
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


  const {data}=useContractRead({
    address:ethers.utils.getAddress(contractaddress),
    abi:abi,
    functionName:'swapCount',
    chainId:chain.id,
    enabled:Boolean(contractaddress),
    onSuccess(data) {
        console.log(data.toNumber())
        settotalswaps(data.toNumber())
      },
  });

  const {openswapsdata}=useContractRead({
    address:ethers.utils.getAddress(contractaddress),
    abi:abi,
    functionName:'swapCount',
    chainId:chain.id,
    enabled:Boolean(contractaddress),
    onSuccess(openswapsdata) {
        console.log(data)
      },
  });


  function FetchOpenSwaps(props){
     setswapindexarr(Array.from(Array(totalswaps).keys()))
  }

  useEffect(()=>{
    setswapindexarr(Array.from(Array(totalswaps).keys()))

  },[totalswaps])


  useEffect(()=>{
    console.log(swapIndexarr)
  },[swapIndexarr])

  return (
    <div >
    <Box backgroundColor="#ECC9EE" pt="3%" h={"100%"}>
      <Flex direction="column">
        {
          
          (<NoNfts/>)
        }

        {
          swapIndexarr && swapIndexarr.map((e,i)=><GetSwap props={e}/>)
        }
        
        
           
    </Flex>  
    </Box>
    
    </div>
  )
}

export default Discover