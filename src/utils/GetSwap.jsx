import { useContractRead, useNetwork } from "wagmi";
import React, { useEffect, useState } from 'react'
import { abi, swapaddressethtestnet, swapaddresspolytestnet } from "../Constants";
import { ethers } from "ethers";
import { Badge, Box, Button, Flex, Image } from "@chakra-ui/react";
import img_error from "../Assets/img_error.png";
import { Alchemy, Network } from "alchemy-sdk";
import {  Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import Assets from "../Pages/Assets";


function GetSwap(props) {
    props=props.props

    const [contractaddress, setcontractaddress] = useState(swapaddressethtestnet);
    const [nftobj,setnftobj]=useState();
    const [nfttokenaddresses,setnfttokenaddresses] = useState();
    const[correctcntaddress, setcorrectcntaddress] = useState(false);
    const[nftokenId,setnfttokenid] = useState();
    const[NftMetadata,setNftMetadata]=useState();
    const[alchemy,setalchemy] = useState();

    const { chain } = useNetwork();

    let settings;

    
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
      console.log(settings)
      fetchmetadata()
    }, [chain,nftokenId,nfttokenaddresses]);



    const {data}=useContractRead({
        address:ethers.utils.getAddress(contractaddress),
        abi:abi,
        functionName:'swaps',
        args:[props],
        chainId:chain?.id,
        enabled:Boolean(correctcntaddress),
        onSuccess(data) {
            setnftobj(data);
          },
      });

      const {addressdata}=useContractRead({
        address:ethers.utils.getAddress(contractaddress),
        abi:abi,
        functionName:'getCSwapTokenAddress',
        args:[props,0],
        chainId:chain?.id,
        enabled:Boolean(correctcntaddress),
        onSuccess(addressdata) {
            console.log(addressdata);
            setnfttokenaddresses(addressdata)
          },
      });

      const {tokenIddata}=useContractRead({
        address:ethers.utils.getAddress(contractaddress),
        abi:abi,
        functionName:'getCSwapTokenId',
        args:[props,0],
        chainId:chain?.id,
        enabled:Boolean(correctcntaddress),
        onSuccess(tokenIddata) {
            console.log(tokenIddata.toNumber());
            setnfttokenid(tokenIddata.toNumber());
          },
      });

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

      async function fetchmetadata(){
        console.log(nftokenId)
        console.log(nfttokenaddresses)
        if(nftokenId!=undefined && nfttokenaddresses!=undefined ){
            console.log("here")
             let response=await alchemy.nft.getNftMetadata(nfttokenaddresses,nftokenId);
             console.log(response);
             setNftMetadata(response);
        }
      }

      const  { isOpen, onOpen, onClose } = useDisclosure()
      const btnRef = React.useRef(null)
      function NFTModal() {

      return (
        <div></div>
      )
    }


       return (
        <div>
        <Box maxW="sm" minH="lg"  borderWidth='3px' borderRadius='2xl' boxShadow="dark-lg" overflow='hidden' boxSize="sm" my="1%" backgroundColor="#191825"> 
         <Image boxSize="xs" ml="6%" pl="3%" my="2%" pt="2%" src={NftMetadata?.tokenUri?.gateway  || NftMetadata?.media[0]?.gateway||NftMetadata?.media[0]?.thumbnail|| img_error} alt={"NFT image"} />
         <Box px='6' py='2' >
            <Box display='flex' justifyContent="space-between">
            <Badge borderRadius='full' px='2' colorScheme="orange">
                    {NftMetadata?.tokenType}
            </Badge>
                <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            fontSize='xs'
            textTransform='uppercase'
            ml='2'
          >
            {formatcontractaddress(NftMetadata?.contract?.address)}  &bull; #{nftokenId} 
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
          {NftMetadata?.contract?.name || "Untitled" } &bull; {NftMetadata?.contract?.symbol || "Untitled" }
        </Box>
        <Flex direction="column"  >
        <Button my="3%" backgroundColor="#191825" color="#E384FF" variant="outline" colorScheme="#E384FF" onClick={onOpen}>Offer-Swap</Button>
        <Button  backgroundColor="#191825" color="#E384FF" variant="outline" colorScheme="#E384FF">Connect</Button>
        </Flex>
         </Box>
        </Box>
        <div>
            <Modal
            onClose={onClose}
            finalFocusRef={btnRef}
            isOpen={isOpen}
            scrollBehavior={'outside'}
            size="6xl"
          >
            <ModalOverlay bg='blackAlpha.300'
      backdropFilter='blur(10px) hue-rotate(10deg)'/>
            <ModalContent>
              <ModalHeader>Pick your NFT to swap</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Assets discover={true} swapId={props}/>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
    </div>
       )
}

export default GetSwap
