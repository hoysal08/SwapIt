import { Badge, Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import img_error from "../Assets/img_error.png";
import { useContractWrite, useFeeData, useNetwork, usePrepareContractWrite } from 'wagmi';
import { abi, swapaddressethtestnet, swapaddresspolytestnet } from '../Constants';
import { Alchemy, Network } from 'alchemy-sdk';
import { useNavigate } from 'react-router-dom';


function SwapCard({swapId,NFTobj}) {

    const[alchemy,setalchemy] = useState();
    const[NftMetadata,setNftMetadata]=useState();
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
        fetchmetadata()
      }, [chain]);

    async function fetchmetadata(){
        if(NFTobj?.tokenId!==undefined && NFTobj?.contractaddres!==undefined && correctcntaddress){
             let response=await alchemy.nft.getNftMetadata(NFTobj.contractaddres,NFTobj.tokenId);
             setNftMetadata(response);
        }
      }
      useEffect(()=>{
        // console.log(NftMetadata);
      },[NftMetadata]);

      useEffect(()=>{
        fetchmetadata()
      },[correctcntaddress])

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
        <Box pl="2%">
        <Text as='samp' fontSize="xl">Offers for SwapID : {swapId}</Text>
        <Box pl="10%">
        <Box maxW="sm" minH="lg"  borderWidth='3px' borderRadius='2xl' boxShadow="dark-lg" overflow='hidden' boxSize="sm" my="1%" backgroundColor="#191825"> 
         <Image boxSize="xs" ml="6%" pl="3%" my="2%"  src={ NftMetadata?.tokenUri?.gateway  || NftMetadata?.media[0]?.gateway||NftMetadata?.media[0]?.thumbnail|| img_error} alt={"NFT image"} />
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
          {NftMetadata?.contract?.name|| "Untitled" } &bull; {NftMetadata?.contract?.symbol || "Untitled" }
        </Box>
        <Flex direction="column"  >
        <Button my="3%" backgroundColor="#191825" color="#E384FF" variant="outline" colorScheme="#E384FF" onClick={handleAcceptOffer}>Accept Offer</Button>
        <Button  backgroundColor="#191825" color="#E384FF" variant="outline" colorScheme="#E384FF" onClick={()=>{console.log("clcick"); navigate('/connect',{ state:{metdata:NftMetadata,NFTOBJ:NFTobj}})}}  >Connect</Button>
        </Flex>
         </Box>
         </Box>
        </Box>
        </Box>
    </div>
  )
}

export default SwapCard

//{swapId,NFTobj,nftmeta}