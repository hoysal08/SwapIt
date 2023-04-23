import React, { useEffect, useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import { useNetwork ,useAccount, useFeeData} from "wagmi";
import { Box, Flex } from "@chakra-ui/react";
import NftCard from "../Components/NftCard";
import NftCardHolder from "../Components/NftCardHolder";

function Assets() {

    const { chain } = useNetwork();
    const { address } = useAccount();

    const [NFTdata,setNftdata]=useState();
    const [regroupednft,setregroupednft]=useState([])

    
    let alchemy;
    let settings;

    

      const fetchNftss=async()=>{
        let res=await alchemy.nft.getNftsForOwner(address)
        res=res?.ownedNfts
        console.log(res)
        setNftdata(res)
    }

    const groupnftdata=()=>{
        let group = [];
        const n=3;
        for (let i = 0, j = 0; i < NFTdata?.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(NFTdata[i])
        }
        setregroupednft(group)
    }
    
    
    useEffect(() => {
     settings = {
      apiKey: process.env.REACT_APP_ALCHEMY_ID,
      network: Network.ETH_GOERLI,
    };
    if (chain.id === 1) {
        settings = {
            apiKey: process.env.ALCHEMY_ID,
            network: Network.ETH_MAINNET,
          };
    }
    if (chain.id === 5) {
        settings = {
            apiKey: process.env.ALCHEMY_ID,
            network: Network.ETH_GOERLI,
          };
    }
    if (chain.id === 137) {
        settings = {
            apiKey: process.env.ALCHEMY_ID,
            network: Network.MATIC_MAINNET,
          };
    }
    if (chain.id === 80001) {
        settings = {
            apiKey: process.env.ALCHEMY_ID,
            network: Network.MATIC_MUMBAI,
          };
    }
    alchemy=new Alchemy(settings)
    fetchNftss()
  }, [chain,address]);

  useEffect(()=>{
    groupnftdata()
  },[NFTdata])
  
  
  return (
  <div >
    <Box backgroundColor="#ECC9EE">
      <Flex direction="column">
        {
          regroupednft && regroupednft.map((nftarr)=><NftCardHolder nftarray={nftarr}/>)
        }
           
    </Flex>  
    </Box>
    
    </div>
  );
}

export default Assets;
