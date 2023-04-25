import { Box, Flex } from '@chakra-ui/react'
import React, { useState } from 'react'
import NoNfts from '../Components/NoNfts'
import { useNetwork, useSigner } from 'wagmi';
import { swapaddressethtestnet, swapaddresspolytestnet } from '../Constants';
import { ethers } from 'ethers';

function Discover() {


  const { chain } = useNetwork();
  const { signer } = useSigner();

  const [contractaddress, setcontractaddress] = useState(swapaddressethtestnet);
  const [NFTdata,setNftdata]=useState();
  const [regroupednft,setregroupednft]=useState([])



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

  return (
    <div >
    <Box backgroundColor="#ECC9EE" pt="3%" h={"100%"}>
      <Flex direction="column">
        {
         
          (<NoNfts/>)
        }
           
    </Flex>  
    </Box>
    
    </div>
  )
}

export default Discover