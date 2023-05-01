import { Badge, Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import img_error from "../Assets/img_error.png";
import { useContractWrite, useFeeData, useNetwork, usePrepareContractWrite } from 'wagmi';
import { abi, swapaddressethtestnet, swapaddresspolytestnet } from '../Constants';
import { Alchemy, Network } from 'alchemy-sdk';
import { useNavigate } from 'react-router-dom';


function ConnectCard({swapId,NFTobj,nftmeta}) {

    const[alchemy,setalchemy] = useState();
    const [contractaddress, setcontractaddress] = useState(swapaddressethtestnet);
    const[correctcntaddress, setcorrectcntaddress] = useState(false);


    let settings;
    const { chain } = useNetwork();


    // console.log(NFTobj);

    let navigate=useNavigate();

    useEffect(() => {
   
        // if (chain.id === 1) {
        //     settings = {
        //         apiKey: process.env.ALCHEMY_ID,
        //         network: Network.ETH_MAINNET,
        //       };
        // }
        if (chain?.id === 11155111) {
          setcontractaddress(swapaddressethtestnet)
            settings = {
                apiKey: process.env.ALCHEMY_ID,
                network: Network.ETH_SEPOLIA,
              };
        }
        // if (chain.id === 137) {
        //     settings = {
        //         apiKey: process.env.ALCHEMY_ID,
        //         network: Network.MATIC_MAINNET,
        //       };
        // }
        if (chain?.id === 80001) {
          setcontractaddress(swapaddresspolytestnet)
            settings = {
                apiKey: process.env.REACT_APP_ALCHEMY_ID_POLY,
                network: Network.MATIC_MUMBAI,
              };
        }
       setalchemy(new Alchemy(settings))
       setcorrectcntaddress(true)
      }, [chain]);


    function formatcontractaddress(addr) {

        if(addr===undefined){
            addr=ethers.constants.AddressZero
        }
        return (
          addr.substring(0, 4) +
          "...." +
          addr.slice(-4)
        );
      }

      let { config: AcceptOfferconfig } = usePrepareContractWrite({
        address: contractaddress,
        abi: abi,
        functionName: "acceptOffer",
        args: [swapId,0],
        enabled: Boolean(correctcntaddress),
        
      });
      const { write: acceptswapWrite } = useContractWrite(AcceptOfferconfig);
    
      function handleAcceptOffer(){
        acceptswapWrite?.()
      }

  return (
    <div>
        <Box pl="2%" pt="5%">
        <Text pl="12%" as='samp' fontSize="xl">Connect With Owner for Swap : {swapId}</Text>
        <Box pl="10%"  pt="5%">
        <Box maxW="sm" minH="lg"  borderWidth='3px' borderRadius='2xl' boxShadow="dark-lg" overflow='hidden' boxSize="sm" my="1%" backgroundColor="#191825"> 
         <Image boxSize="xs" ml="6%" pl="3%" my="2%"  src={ nftmeta?.tokenUri?.gateway  || nftmeta?.media[0]?.gateway||nftmeta?.media[0]?.thumbnail|| img_error} alt={"NFT image"} />
         <Box px='6' py='2' >
            <Box display='flex' justify="space-between">
                <Badge borderRadius='full' px='2' colorScheme="orange">
                    {swapId}
                </Badge>
                <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            fontSize='xs'
            textTransform='uppercase'
            ml='2'
          >
            {formatcontractaddress(NFTobj?.contractaddres)}  &bull; #{NFTobj?.tokenId} 
          </Box>
        </Box>
        <Box
          mt='1'
          fontWeight='semibold'
          as='samp'
          lineHeight='tight'
          noOfLines={1}
          color='gray.500'
        >
          {nftmeta?.contract?.name|| "Untitled" } &bull; {nftmeta?.contract?.symbol || "Untitled" }
        </Box>
        <Flex direction="column"  >
        <Button my="3%" backgroundColor="#191825" color="#E384FF" variant="outline" colorScheme="#E384FF" onClick={handleAcceptOffer}>Accept Offer</Button>
        <Button  backgroundColor="#191825" color="#E384FF" variant="outline" colorScheme="#E384FF" onClick={()=>{navigate('/connect',{ state:{metdata:nftmeta,NFTOBJ:NFTobj}})}}  >Connect</Button>
        </Flex>
         </Box>
         </Box>
        </Box>
        </Box>
    </div>
  )
}

export default ConnectCard