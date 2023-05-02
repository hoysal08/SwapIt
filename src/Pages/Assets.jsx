import React, { useEffect, useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import { useNetwork ,useAccount, useFeeData} from "wagmi";
import { Box, Flex } from "@chakra-ui/react";
import NftCard from "../Components/NftCard";
import NftCardHolder from "../Components/NftCardHolder";
import NoNfts from "../Components/NoNfts";
import axios from "axios";

function Assets(props) {
 let discoverpage=props?.discover;
 let swapid=props?.swapId;
    
    const { chain } = useNetwork();
    const { address } = useAccount();
    const [filNFT,setfilNFT]=useState()
    const [NFTdata,setNftdata]=useState([]);
    const [regroupednft,setregroupednft]=useState([])
    const[onlyerc721,setonlyerc721]=useState(false);
    const[isitfilcoin,setisitfilcoin]=useState(false);

    
    let alchemy;
    let settings;

    async function fetchfilecoinNFTS()
    {
      if(address!=undefined){
        let filecoinAPI=`https://mintboxx.onrender.com/api/ERC721Transfers?owner=${address}`
        let response=axios.get(filecoinAPI).then((response) =>{
                console.log(response);
                setfilNFT(response.data.allNFTs)
              })
      }
    }

      const fetchNftss=async()=>{
        let res=await alchemy.nft.getNftsForOwner(address)
        res=res?.ownedNfts
        setNftdata(res)
    }

    function fetchonlyerc721(){
      let onlyerc721arr=[]       
      if(NFTdata.length>0 && !onlyerc721){
              for(let i=0;i<NFTdata.length;i++){
                if(NFTdata[i].tokenType==='ERC721'){
                  onlyerc721arr.push(NFTdata[i])
                }
             }
            setNftdata(onlyerc721arr);
            setonlyerc721(true);
      }
    }

    const groupnftdataFIL=()=>{
      if( filNFT?.length>0){
        let group = [];
        const n=3;
        for (let i = 0, j = 0; i < filNFT?.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(filNFT[i])
        }
        setregroupednft(group);
      }
    }

    const groupnftdata=()=>{
      if(onlyerc721 && NFTdata.length>0){
        let group = [];
        const n=3;
        for (let i = 0, j = 0; i < NFTdata?.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(NFTdata[i])
        }
        setregroupednft(group);
      }
    }
    

    useEffect(()=>{
          groupnftdataFIL()
    },[filNFT])
    
    useEffect(() => {
     
    // if (chain.id === 1) {
    //     settings = {
    //         apiKey: process.env.ALCHEMY_ID,
    //         network: Network.ETH_MAINNET,
    //       };
    // }
    if (chain?.id === 11155111) {
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
        settings = {
            apiKey: process.env.REACT_APP_ALCHEMY_ID_POLY,
            network: Network.MATIC_MUMBAI,
          };
    }

    if(chain?.id===3141){
           setisitfilcoin(true)
           fetchfilecoinNFTS()
    }
    if(chain.id!==3141){
          alchemy=new Alchemy(settings)
          fetchNftss()
    }
  }, [chain,address]);

  useEffect(()=>{
    groupnftdata()
  },[onlyerc721])

  useEffect(()=>{
    fetchonlyerc721()
  },[NFTdata])


  
  
  return (
  <div >
    <Box backgroundColor="#ECC9EE" pt="3%" h={NFTdata?.length>3?"100%":"100vh"}>
      <Flex direction="column">
        {
          regroupednft?.length>0? (regroupednft.map((nftarr,i)=><NftCardHolder key={i} nftarray={nftarr} discover={discoverpage} swapId={swapid} fil={isitfilcoin} />))
          :
          (<NoNfts discover={discoverpage} text="You Don't own any NFT's" />)
        }
           
    </Flex>  
    </Box>
    
    </div>
  );
}

export default Assets;
