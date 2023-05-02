import React, { useEffect, useState } from "react";
import { useHuddle01 } from "@huddle01/react";
import { HuddleIframe, IframeConfig } from "@huddle01/huddle01-iframe";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { useAccount, useSigner } from "wagmi";
import Huddlecomp from "../Components/Huddle";
import PushComp from "../Components/PushComp";
import { useLocation } from "react-router-dom";
import ConnectCard from "../Components/ConnectCard";
import * as PushAPI from "@pushprotocol/restapi"
import { ethers } from "ethers";


function Connect() {
  const location = useLocation();

  const[metadata,setmatadat]=useState()
  const[swapid,setswapid]=useState()
  const[nftobj,setnftobj]=useState()
  const[enablechat,setenablechat]=useState(false)
  const[enablehuddle,setenablehuddle]=useState(false)
  const[buyer,setbuyer]=useState();
  const [roomId, setroomID] = useState("");

  const{address}=useAccount();
  const { data: signer } = useSigner();





  useEffect(()=>{
       setmatadat(location?.state?.metdata);
       setnftobj(location?.state?.NFTOBJ)
  },[location])

  useEffect(()=>{

    console.log(nftobj)
    if(nftobj!=undefined){
    let num=Number(nftobj?.swapId._hex)
    setswapid(num)
    setbuyer(nftobj?.buyer)
    if(nftobj?.buyer==ethers.constants.AddressZero)
    {
      setbuyer(nftobj?.seller)
    }
    }
  },[nftobj])

//   const [roomId, setroomID] = useState("");
//   const{address}=useAccount();

//   const iframeConfig = {
//     roomUrl: `https://iframe.huddle01.com/${roomId}`,
//     height: "660px",
//     width: "100%",
//     noBorder: false, // false by default
//   };

//   async function createroom() {

//     if(roomId==""){
//       const response = await axios.post(
//   'https://iriko.testing.huddle01.com/api/v1/create-iframe-room',
//   {
//     title: 'Huddle01-Test',
//     roomLocked: true
//   },
//   {
//     headers: {
//       'Content-Type': 'application/json',
//       'x-api-key':process.env.REACT_APP_API_KEY,
//     },
//   }
// );
// console.log(response);
// setroomID(response?.data.data.roomId);
// console.log(response?.data.data.roomId)
//     }
    
//   }

  
//   useEffect(() => {
//     // its preferable to use env vars to store projectId
//     createroom();
//   }, []);

async function createroom() {

  if(roomId==""){
    const response = await axios.post(
'https://iriko.testing.huddle01.com/api/v1/create-iframe-room',
{
  title: 'Huddle01-Test',
  roomLocked: true
},
{
  headers: {
    'Content-Type': 'application/json',
    'x-api-key':process.env.REACT_APP_API_KEY,
  },
}
);
console.log(response);
setroomID(response?.data.data.roomId);
console.log(response?.data.data.roomId)
  }
}
console.log(roomId)
async function sendmessage(){
  // pre-requisite API calls that should be made before
// need to get user and through that encryptedPvtKey of the user

console.log(signer)
console.log(address)
console.log(buyer)
const user = await PushAPI.user.get({
  account: `eip155:${address}`,
  env: 'staging'
});

if(user==null){
  user = await PushAPI.user.create({
   account: `${address}`
});

 user = await PushAPI.user.get({
 account: `eip155:${address}`,
 env: 'staging'
});
}

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
  encryptedPGPPrivateKey: user.encryptedPrivateKey, 
  signer: signer,
  env: 'staging'
});

console.log(pgpDecryptedPvtKey)

// actual api
const response = await PushAPI.chat.send({
messageContent: `Join the call here , https://iframe.huddle01.com/${roomId}`,
messageType: 'Text',  
receiverAddress: `eip155:${buyer}`,
signer: signer,
pgpPrivateKey: pgpDecryptedPvtKey,
env: 'staging'
});

console.log(response);
}
 function handlechatbtn(){
  setenablechat(true)
 }

 function handlehuddlebtn(){
  createroom()
 }


 useEffect(()=>{
   if(roomId!=""){
    console.log(roomId)
    sendmessage()
  setenablehuddle(true)
   }
 },[roomId])

  return (
  <div >
    <Box backgroundColor="#ECC9EE" >
    {enablehuddle ?(<Huddlecomp roomID={roomId}/>) :(
      (metadata && nftobj) && (
  <Box>
<Flex direction="row" >
<Box pl="8%" w="40%" h="100vh">
<ConnectCard swapId={swapid} NFTobj={nftobj} nftmeta={metadata} />
</Box>
<Flex direction="column" px="20%" py="10%" justify="space-evenly">
    <Button w="250px" h="70px"  backgroundColor="#191825" color="#E384FF"  colorScheme="#E384FF" borderWidth="5" onClick={handlechatbtn}>Chat</Button>
    <Button w="250px" h="70px" borderColor="#E384FF" border="5" backgroundColor="#191825" color="#E384FF"  colorScheme="#E384FF" onClick={handlehuddlebtn}>Huddle</Button>
</Flex>
{enablechat && <PushComp reciever={buyer}/>}
</Flex>
</Box>)
    )}

  </Box>
 </div>
  );
}

export default Connect;

{/* <PushComp/> */}
{/* <Huddlecomp/>    */}