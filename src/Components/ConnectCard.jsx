import { Badge, Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { Signer, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import img_error from "../Assets/img_error.png";
import {
  useContractWrite,
  useFeeData,
  useNetwork,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import {
  abi,
  filmarketaddress,
  filnftabi,
  swapaddressethtestnet,
  swapaddresspolytestnet,
} from "../Constants";
import { Alchemy, Network, NftTokenType } from "alchemy-sdk";
import { useNavigate } from "react-router-dom";

function ConnectCard({ swapId, NFTobj, nftmeta }) {
  const [alchemy, setalchemy] = useState();
  const [contractaddress, setcontractaddress] = useState(swapaddressethtestnet);
  const [correctcntaddress, setcorrectcntaddress] = useState(false);
  const [isitfilcoin, setisitfilcoin] = useState(true);
  const [nftcontractaddress, setnftcontractaddress] = useState();
  const [nfttokenId, stnfttokenID] = useState();

  let settings;
  const { chain } = useNetwork();
  let navigate = useNavigate();
  const { data: signer } = useSigner();

  useEffect(() => {
    if (chain.id === 3141) {
      setisitfilcoin(true);
      setcontractaddress(ethers.utils.getAddress(filmarketaddress));
    }

    if (chain?.id === 11155111) {
      setisitfilcoin(false);
      setcontractaddress(swapaddressethtestnet);
      settings = {
        apiKey: process.env.ALCHEMY_ID,
        network: Network.ETH_SEPOLIA,
      };
    }
    if (chain?.id === 80001) {
      setisitfilcoin(false);

      setcontractaddress(swapaddresspolytestnet);
      settings = {
        apiKey: process.env.REACT_APP_ALCHEMY_ID_POLY,
        network: Network.MATIC_MUMBAI,
      };
    }

    setalchemy(new Alchemy(settings));
    setcorrectcntaddress(true);
  }, [chain, NFTobj, correctcntaddress]);

  useEffect(() => {
    if (isitfilcoin) {
      gettokendata();
    }
  });

  function formatcontractaddress(addr) {
    if (addr === undefined) {
      addr = ethers.constants.AddressZero;
    }
    return addr.substring(0, 4) + "...." + addr.slice(-4);
  }

  let { config: AcceptOfferconfig } = usePrepareContractWrite({
    address: contractaddress,
    abi: abi,
    functionName: "acceptOffer",
    args: [swapId, 0],
    enabled: Boolean(correctcntaddress),
  });
  const { write: acceptswapWrite } = useContractWrite(AcceptOfferconfig);

  function handleAcceptOffer() {
    acceptswapWrite?.();
  }

  async function gettokendata() {
    if (contractaddress != undefined) {
      let contract = new ethers.Contract(contractaddress, abi, signer);
      setnftcontractaddress(await contract.getCSwapTokenAddress(swapId, 0));
      let tokenidhex = await contract.getCSwapTokenId(swapId, 0);
      stnfttokenID(tokenidhex.toNumber());
    }
  }
  return (
    <div>
      {isitfilcoin ? (
        <Box pl="2%" pt="5%">
          <Text pl="12%" as="samp" fontSize="xl">
            Connect With Owner for Swap : {swapId}
          </Text>
          <Box pl="10%" pt="5%">
            <Box
              maxW="sm"
              minH="lg"
              pt="5%"
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
                src={nftmeta}
                alt={"NFT image"}
              />
              <Box px="6" py="2">
                <Flex direction="row" justify="space-between">
                  <Badge borderRadius="full" px="2" colorScheme="orange">
                    {swapId}
                  </Badge>
                  <Box
                    color="gray.500"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    fontSize="xs"
                    textTransform="uppercase"
                    ml="10"
                  >
                    {formatcontractaddress(nftcontractaddress)} &bull; #
                    {nfttokenId}
                  </Box>
                </Flex>
                <Box
                  mt="1"
                  fontWeight="semibold"
                  as="samp"
                  lineHeight="tight"
                  noOfLines={1}
                  color="gray.500"
                >
                  {nftmeta?.contract?.name || "Name"} &bull;{" "}
                  {nftmeta?.contract?.symbol || "Symbol"}
                </Box>
                <Flex pt="3%" direction="column">
                  <Button
                    my="3%"
                    backgroundColor="#191825"
                    color="#E384FF"
                    variant="outline"
                    colorScheme="#E384FF"
                    onClick={handleAcceptOffer}
                  >
                    Accept Offer
                  </Button>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box pl="2%" pt="5%">
          <Text pl="12%" as="samp" fontSize="xl">
            Connect With Owner for Swap : {swapId}
          </Text>
          <Box pl="10%" pt="5%">
            <Box
              maxW="sm"
              minH="lg"
              pt="5%"
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
                  nftmeta?.tokenUri?.gateway ||
                  nftmeta?.media[0]?.gateway ||
                  nftmeta?.media[0]?.thumbnail ||
                  img_error
                }
                alt={"NFT image"}
              />
              <Box px="6" py="2">
                <Flex direction="row" justify="space-between">
                  <Badge borderRadius="full" px="2" colorScheme="orange">
                    {swapId}
                  </Badge>
                  <Box
                    color="gray.500"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    fontSize="xs"
                    textTransform="uppercase"
                    ml="10"
                  >
                    {formatcontractaddress(nftmeta?.contract?.address)} &bull; #
                    {nftmeta?.tokenId}
                  </Box>
                </Flex>
                <Box
                  mt="1"
                  fontWeight="semibold"
                  as="samp"
                  lineHeight="tight"
                  noOfLines={1}
                  color="gray.500"
                >
                  {nftmeta?.contract?.name || "Name"} &bull;{" "}
                  {nftmeta?.contract?.symbol || "Symbol"}
                </Box>
                <Flex pt="3%" direction="column">
                  <Button
                    my="3%"
                    backgroundColor="#191825"
                    color="#E384FF"
                    variant="outline"
                    colorScheme="#E384FF"
                    onClick={handleAcceptOffer}
                  >
                    Accept Offer
                  </Button>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
}

export default ConnectCard;
