import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Badge, Box, Button, Flex, Image, Input, Text, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import img_error from "../Assets/img_error.png";
 import{useDebounce} from "usehooks-ts"

import {
    Context,
  erc721ABI,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";

import {
  abi,
  swapaddressethtestnet,
  swapaddresspolytestnet,
} from "../Constants";

import { ethers } from "ethers";

function NftCard({ NFTobj }) {

  function formatcontractaddress(addr) {
    return (
      addr.substring(0, 4) +
      "...." +
      addr.slice(-4)
    );
  }

  const { chain } = useNetwork();
  const { signer } = useSigner();

  const [approved, setapproved] = useState(false);
  const [contractaddress, setcontractaddress] = useState(swapaddressethtestnet);
  const [description, setdescription] = useState("")
  const debouncedContractaddress=useDebounce(contractaddress,5000);

  function getcontractaddress() {
    if (chain.id === 11155111) {
      setcontractaddress(ethers.utils.getAddress(swapaddressethtestnet));
    }
    if (chain.id === 80001) {
      setcontractaddress(ethers.utils.getAddress(swapaddresspolytestnet));
    }
  }

  const {data}=useContractRead({
    address:ethers.utils.getAddress(contractaddress),
    abi:abi,
    functionName:'isApprovedfunc',
    args:[ethers.utils.getAddress(NFTobj?.contract.address),parseInt(NFTobj?.tokenId)],
    chainId:chain.id,
    enabled:Boolean(contractaddress),
    onSuccess(data) {
        setapproved(data)
      },
  });

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()


  const { config:createswapconfig } = usePrepareContractWrite({
    address: `${ethers.utils.getAddress(contractaddress)}`,
    abi: abi,
    functionName: "createSwap",
    args: [[ethers.utils.getAddress(NFTobj?.contract.address)],[ NFTobj?.tokenId],description],
    enabled: Boolean(description)
  });
  const{write:createswapwrite}=useContractWrite(createswapconfig)
  
  function createnewswap() {
    createswapwrite?.()
    onClose()
  }

  const { config:approveconfig } = usePrepareContractWrite({
    address: `${ethers.utils.getAddress(NFTobj?.contract?.address)}`,
    abi: erc721ABI,
    functionName: "approve",
    args: [debouncedContractaddress, NFTobj?.tokenId],
  });

  const { write:approvewrite } = useContractWrite(approveconfig);

  async function getapproval() {
    approvewrite?.();
  }

  useEffect(() => {
    getcontractaddress();
  }, [chain]);


  return (
    <div>
      <Box
        maxW="sm"
        minH="lg"
        borderWidth="3px"
        borderRadius="2xl"
        boxShadow="dark-lg"
        overflow="hidden"
        boxSize="sm"
        my="1%"
        backgroundColor="#191825"
      >
        <Image
          boxSize="xs"
          ml="6%"
          pl="3%"
          my="2%"
          src={
            NFTobj?.media[0]?.thumbnail ||
            NFTobj?.media[0]?.gateway ||
            NFTobj?.tokenUri?.gateway ||
            img_error
          }
          alt={"NFT image"}
        />
        <Box px="6" py="2" justifyContent="space-evenly">
          <Box display="flex" justifyContent="space-between">
            <Badge borderRadius="full" px="2" colorScheme="orange">
              {NFTobj?.balance}
            </Badge>
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              {formatcontractaddress(NFTobj?.contract.address)} &bull; #
              {NFTobj?.tokenId}
            </Box>
          </Box>
          <Box
            mt="1"
            fontWeight="semibold"
            as="samp"
            lineHeight="tight"
            noOfLines={1}
            color="gray.500"
            my="5"
          >
            {NFTobj?.contract?.name || "Untitled"} &bull;{" "}
            {NFTobj?.contract?.symbol || "Untitled"}
          </Box>
          <Flex direction="column" justify="center">
            <Button
              my="3%"
              backgroundColor="#191825"
              color="#E384FF"
              variant="outline"
              colorScheme="#E384FF"
              onClick={() => {
                approved ? onOpen() : getapproval();
              }}
            >
              {approved ? "Open Swap" : "Approve "}
            </Button>
          </Flex>

          <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay >
          <AlertDialogContent color="#E384FF" backgroundColor="#191825">
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Add description and confirm Swap
            </AlertDialogHeader>

            <AlertDialogBody>
              <Input value={description} onChange={(e)=>setdescription(e.target.value)} placeholder="Looking for BAYC" _placeholder={{ opacity: 0.4, color: 'white' }} />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} >
                <Text opacity="0.8" color='black'>
                    Cancel
                </Text>
                
              </Button>
              <Button backgroundColor="#E384FF" onClick={createnewswap} ml={3}>
              <Text opacity="0.8" color='black'>
                    Confirm
                </Text>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
        </Box>
      </Box>
    </div>
  );
}

export default NftCard;
