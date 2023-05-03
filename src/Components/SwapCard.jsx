import { Badge, Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { ethers } from 'ethers';
import React, { useEffect, useRef, useState } from 'react'
import img_error from "../Assets/img_error.png";
import { useContractWrite, useFeeData, useNetwork, usePrepareContractWrite, useSigner } from 'wagmi';
import { abi, filmarketaddress, filnftabi, swapaddressethtestnet, swapaddresspolytestnet } from '../Constants';
import { Alchemy, Network } from 'alchemy-sdk';
import { useNavigate } from 'react-router-dom';


function SwapCard({swapId,NFTobj}) {

  console.log(NFTobj)

    const[alchemy,setalchemy] = useState();
    const[NftMetadata,setNftMetadata]=useState();
    const [contractaddress, setcontractaddress] = useState(swapaddressethtestnet);
    const[correctcntaddress, setcorrectcntaddress] = useState(false);
    const[isitfilcoin,setisitfilcoin]=useState(false);
    const[NFTURI,setnfturi] = useState();



    let settings;
    const { chain } = useNetwork();
    const { data:signer } = useSigner();



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
        if(chain?.id===3141){
          setisitfilcoin(true)
          setcontractaddress(ethers.utils.getAddress(filmarketaddress));
          fetchmetadatafil()
        }
        if(chain?.id!==3141){
          fetchmetadata()
        }
        setalchemy(new Alchemy(settings))
       setcorrectcntaddress(true)
      }, [chain,contractaddress]);

    async function fetchmetadata(){
        if(NFTobj?.tokenId!==undefined && NFTobj?.contractaddres!==undefined && correctcntaddress){
             let response=await alchemy.nft.getNftMetadata(NFTobj.contractaddres,NFTobj.tokenId);
             setNftMetadata(response);
        }
      }
      async function fetchmetadatafil(){
        if(NFTobj?.tokenId!==undefined && NFTobj?.contractaddres!==undefined && correctcntaddress){
          const contract=new ethers.Contract(NFTobj?.contractaddres,filnftabi,signer);
        setnfturi(await contract.tokenURI(NFTobj?.tokenId));
        }
      }

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
        <Text pt="2%" pl="4%" as='samp' fontSize="xl">Offers for SwapID : {swapId}</Text>
        <Box pl="10%" pt="2%">
        <Box maxW="sm" minH="lg"  borderWidth='3px' borderRadius='2xl' boxShadow="dark-lg" overflow='hidden' boxSize="sm" my="1%" backgroundColor="#191825"> 
         <Image boxSize="xs" ml="6%" pl="3%" my="2%"  src={isitfilcoin?(NFTURI):(NftMetadata?.tokenUri?.gateway  || NftMetadata?.media[0]?.gateway||NftMetadata?.media[0]?.thumbnail|| img_error)} alt={"NFT image"} />
         <Box px='6' py='2' >
          <Flex direction="row" justify="space-between">
            
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
                  </Flex>
        <Box
          mt='1'
          fontWeight='semibold'
          as='samp'
          lineHeight='tight'
          noOfLines={1}
          color='gray.500'
        >
          {NftMetadata?.contract?.name|| "Name" } &bull; {NftMetadata?.contract?.symbol || "Symbol" }
        </Box>
        <Flex direction="column"  >
        <Button my="3%" backgroundColor="#191825" color="#E384FF" variant="outline" colorScheme="#E384FF" onClick={handleAcceptOffer}>Accept Offer</Button>
        <Button  backgroundColor="#191825" color="#E384FF" variant="outline" colorScheme="#E384FF" onClick={()=>{ navigate('/connect',{ state:{metdata:isitfilcoin?(NFTURI):(NftMetadata),NFTOBJ:NFTobj}})}}  >Connect</Button>
        </Flex>
         </Box>
         </Box>
        </Box>
        </Box>
    </div>
  )
}

export default SwapCard

