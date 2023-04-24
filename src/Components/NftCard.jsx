import { Badge, Box, Button, Flex, Image } from "@chakra-ui/react";
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
  function formatcontractaddress(address) {
    return (
      NFTobj?.contract.address.substring(0, 4) +
      "...." +
      NFTobj?.contract.address.slice(-4)
    );
  }

  const { chain } = useNetwork();
  const { signer } = useSigner();

  const [approved, setapproved] = useState(false);
  const [contractaddress, setcontractaddress] = useState(swapaddressethtestnet);
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
  })


  const { config:createswapconfig } = usePrepareContractWrite({
    address: `${ethers.utils.getAddress(contractaddress)}`,
    abi: abi,
    functionName: "createSwap",
    args: [[ethers.utils.getAddress(NFTobj?.contract.address)],[ NFTobj?.tokenId]],
  });
  
  function createnewswap() {

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
                approved ? createnewswap() : getapproval();
              }}
            >
              {approved ? "Open Swap" : "Approve "}
            </Button>
          </Flex>
        </Box>
      </Box>
    </div>
  );
}

export default NftCard;
