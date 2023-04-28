import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import img_error from "../Assets/img_error.png";
import { useDebounce } from "usehooks-ts";

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

function NftCard(props) {
  let NFTobj = props?.NFTobj;
  let discoverpage = props?.discover;
  let swapid = props?.swapId;


  function formatcontractaddress(addr) {
    return addr.substring(0, 4) + "...." + addr.slice(-4);
  }

  const { chain } = useNetwork();
  const { signer } = useSigner();

  const [approved, setapproved] = useState(false);
  const [contractaddress, setcontractaddress] = useState();
  const [description, setdescription] = useState("");
  const [correctcntaddress, setcorrectcntaddress] = useState(false);
  const debouncedContractaddress = useDebounce(contractaddress, 5000);

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  function getcontractaddress() {
   
      if (chain.id === 11155111) {
        setcontractaddress(ethers.utils.getAddress(swapaddressethtestnet));
      }
      if (chain.id === 80001) {
        setcontractaddress(ethers.utils.getAddress(swapaddresspolytestnet));
      }
      // setcorrectcntaddress(true);
    
    delay(1000).then(() => {setcorrectcntaddress(true);});
  }

  const { data } = useContractRead({
    address: contractaddress,
    abi: abi,
    functionName: "isApprovedfunc",
    args: [
      ethers.utils.getAddress(NFTobj?.contract.address),
      parseInt(NFTobj?.tokenId),
    ],
    chainId: chain?.id,
    enabled: Boolean(correctcntaddress),
    onSuccess(data) {
      setapproved(data);
    },
    onError(err) {
      setapproved(false)
    },
  });


  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const { config: createswapconfig } = usePrepareContractWrite({
    address: contractaddress,
    abi: abi,
    functionName: "createSwap",
    args: [
      [ethers.utils.getAddress(NFTobj?.contract.address)],
      [NFTobj?.tokenId],
      description,
    ],
    enabled: Boolean(correctcntaddress),
    
  });
  const { write: createswapwrite } = useContractWrite(createswapconfig);

  function createnewswap() {
    createswapwrite?.();
    onClose();
  }

  const { config: approveconfig } = usePrepareContractWrite({
    address: NFTobj?.contract?.address,
    abi: erc721ABI,
    functionName: "approve",
    args: [contractaddress, NFTobj?.tokenId],
    enabled: Boolean(correctcntaddress && contractaddress && NFTobj),
  });

  const { write: approvewrite } = useContractWrite(approveconfig);

  async function getapproval() {
    approvewrite?.();
  }

  useEffect(() => {
    getcontractaddress();
  }, [chain]);


  const { config: offerswapConfig } = usePrepareContractWrite({
    address: contractaddress,
    abi: abi,
    functionName: "proposeOffer",
    args: [
      swapid,
      [ethers.utils.getAddress(NFTobj?.contract.address)],
      [NFTobj?.tokenId],
    ],
    enabled: Boolean(swapid !== undefined && correctcntaddress),
    
  });
  const { write: offerswapwrite } = useContractWrite(offerswapConfig);

  function handleswapclick() {
    if (discoverpage) {
      offerswapwrite?.();
    } else {
      onOpen();
    }
  }

  return (
    <div>
      <Box
        maxW="sm"
        minH={discoverpage ? "md" : "lg"}
        borderWidth="3px"
        borderRadius="2xl"
        boxShadow="dark-lg"
        overflow="hidden"
        boxSize={discoverpage ? "xs" : "sm"}
        my="1%"
        backgroundColor="#191825"
      >
        <Image
          boxSize="xs"
          ml="6%"
          pl="3%"
          my="2%"
          pr={discoverpage ? "15%" : ""}
          py={discoverpage ? "2%" : ""}
          src={
            NFTobj?.media[0]?.thumbnail ||
            NFTobj?.media[0]?.gateway ||
            NFTobj?.tokenUri?.gateway ||
            img_error
          }
          alt={"NFT image"}
        />
        <Box px="6" pt="2" justifyContent="space-evenly">
          <Box display="flex" justifyContent="space-between">
            <Badge borderRadius="full" px="2" colorScheme="orange">
              {NFTobj?.balance}
            </Badge>
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize={discoverpage ? "2xs" : "xs"}
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
            fontSize={discoverpage ? "xs" : ""}
            my={discoverpage ? "2" : "5"}
          >
            {NFTobj?.contract?.name || "Untitled"} &bull;{" "}
            {NFTobj?.contract?.symbol || "Untitled"}
          </Box>
          <Flex direction="column" justify="center">
            <Button
              my={discoverpage ? "0" : "xs"}
              backgroundColor="#191825"
              color="#E384FF"
              variant="outline"
              colorScheme="#E384FF"
              onClick={() => {
                approved ? handleswapclick() : getapproval();
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
            <AlertDialogOverlay>
              <AlertDialogContent color="#E384FF" backgroundColor="#191825">
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Add description and confirm Swap
                </AlertDialogHeader>

                <AlertDialogBody>
                  <Input
                    value={description}
                    onChange={(e) => setdescription(e.target.value)}
                    placeholder="Looking for BAYC"
                    _placeholder={{ opacity: 0.4, color: "white" }}
                  />
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    <Text opacity="0.8" color="black">
                      Cancel
                    </Text>
                  </Button>
                  <Button
                    backgroundColor="#E384FF"
                    onClick={createnewswap}
                    ml={3}
                  >
                    <Text opacity="0.8" color="black">
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
