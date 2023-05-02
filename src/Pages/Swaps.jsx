import { Box, Text } from "@chakra-ui/react";
import { getContractAddress } from "ethers/lib/utils.js";
import React, { useEffect, useState } from "react";
import { useAccount, useContractRead, useNetwork, useSigner } from "wagmi";
import {
  abi,
  swapaddressethtestnet,
  swapaddresspolytestnet,
} from "../Constants";
import { ethers } from "ethers";
import SwapCard from "../Components/SwapCard";
import NoNfts from "../Components/NoNfts";

function Swaps() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [correctcntaddres, setcorrectcntaddres] = useState(false);
  const [contractaddress, setcontractaddress] = useState(swapaddressethtestnet);
  const [openswapcount, setopenswapcount] = useState();
  const [openswapnft, setopenswapnft] = useState([]);
  const [offeredswaps, setofferedswaps] = useState(new Map());
  const[keyarray, setkeyarray] = useState([])
  const[valuesarr, setvaluesarr] = useState([]);

  const { data } = useContractRead({
    address: ethers.utils.getAddress(contractaddress),
    abi: abi,
    functionName: "userSwapCount",
    chainId: chain?.id,
    args: [address],
    enabled: Boolean(correctcntaddres),
    onSuccess(data) {
      setopenswapcount(data.toNumber());
    },
  });

  async function getuserswaps() {
    let res = [];
    if (correctcntaddres && openswapcount && signer) {
      for (let i = 0; i < openswapcount; i++) {
        let contract = new ethers.Contract(contractaddress, abi, signer);
        let temp = await contract.userSwaps(address, i);
        res.push(temp.swapId.toNumber());
      }
      setopenswapnft(res);
    }
  }

  function getuseroffers() {
    if (contractaddress && openswapnft.length > 0) {
      for (let i = 0; i < openswapnft.length; i++) {
        getoffers(openswapnft[i]);
        // you have offer object here ->  get offer object address,Id -> get metadata -> display
      }
    }
  }

  async function getoffers(i) {
    try {
      let res = {};
      let contract = new ethers.Contract(contractaddress, abi, signer);
      let temp = await contract.offers(i, 0);
      let swapId = temp?.swapId.toNumber();
      res[swapId] = temp;
      res[swapId] = {
        ...res[swapId],
        contractaddres: await contract.getOSwapTokenAddress(swapId, 0),
      };
      res[swapId] = {
        ...res[swapId],
        tokenId: (await contract.getOSwapTokenId(swapId, 0)).toNumber(),
      };
       offeredswaps.set(swapId, res[swapId]);
      setofferedswaps(offeredswaps.set(swapId,res[swapId]))
    } catch (err) {
      console.log("No offers exist for swap :" + i);
    }
  }

  function connvertintoarrs(){
    if(valuesarr.length<openswapcount && keyarray.length<openswapcount){
          offeredswaps.forEach((value,key)=>{
             if(keyarray.indexOf(key)===-1){
              setkeyarray(keyarray=>[...keyarray,key]);
              setvaluesarr(valuesarr=>[...valuesarr,value]);
             }
    })
    }
  }

  function getcontractaddress() {
    if (chain?.id === 11155111) {
      setcontractaddress(ethers.utils.getAddress(swapaddressethtestnet));
    }
    if (chain?.id === 80001) {
      setcontractaddress(ethers.utils.getAddress(swapaddresspolytestnet));
    }
    setcorrectcntaddres(true);
  }

  useEffect(() => {
    getcontractaddress();
  }, [chain]);

  useEffect(() => {
    getuserswaps();
  }, [openswapcount]);

  useEffect(() => {
    getuseroffers();
  }, [openswapnft]);

  useEffect(() => {
    connvertintoarrs()
  }, [offeredswaps]);


  useEffect(()=>{
    if(keyarray.length<openswapcount){
      connvertintoarrs()
    }
  },[keyarray])

 connvertintoarrs()

  return (

    <div>
      <Box backgroundColor="#ECC9EE" pt="2%" h={valuesarr.length>1?"100%":"100vh"}>
        {
          valuesarr.length>0 ?
          
         (keyarray.map((val,index)=>{
           return (
           <SwapCard key={index} swapId={val} NFTobj={valuesarr[index]}/>
           )
           }))
           :
           <NoNfts text="You  Don't have any Open-Swaps"/>
        }
      </Box>
    </div>
  );
}

export default Swaps;
