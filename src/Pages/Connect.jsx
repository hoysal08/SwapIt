import React, { useEffect, useState } from "react";
import { useHuddle01 } from "@huddle01/react";
import { HuddleIframe, IframeConfig } from "@huddle01/huddle01-iframe";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { useAccount } from "wagmi";
import Huddlecomp from "../Components/Huddle";
import PushComp from "../Components/PushComp";
import { useLocation } from "react-router-dom";
import ConnectCard from "../Components/ConnectCard";

function Connect() {
  const location = useLocation();
  console.log('location', location)

  const[metadata,setmatadat]=useState()
  const[swapid,setswapid]=useState()
  const[nftobj,setnftobj]=useState()
  const[enablechat,setenablechat]=useState(false)
  const[enablehuddle,setenablehuddle]=useState(false)


  useEffect(()=>{
       setmatadat(location.state.metdata);
       setnftobj(location.state.NFTOBJ)
  },[location])

  useEffect(()=>{
    if(nftobj!=undefined){
    let num=Number(nftobj?.swapId._hex)
    setswapid(num)
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

  return (
  <div >
    <Box backgroundColor="#ECC9EE" >
{(metadata && nftobj) && (
  <Box>
<Flex direction="row" >
<Box pl="8%" w="40%" h="100vh">
<ConnectCard swapId={swapid} NFTobj={nftobj} nftmeta={metadata} />
</Box>
<Flex direction="column" px="20%" py="10%" justify="space-evenly">
    <Button w="250px" h="70px"  backgroundColor="#191825" color="#E384FF"  colorScheme="#E384FF" borderWidth="5">Chat</Button>
    <Button w="250px" h="70px" borderColor="#E384FF" border="5" backgroundColor="#191825" color="#E384FF"  colorScheme="#E384FF">Huddle</Button>
</Flex>

</Flex>
</Box>)}
  </Box>
 </div>
  );
}

export default Connect;

{/* <PushComp/> */}
{/* <Huddlecomp/>    */}