import React, { useEffect, useState } from "react";
import { useHuddle01 } from "@huddle01/react";
import { HuddleIframe, IframeConfig } from "@huddle01/huddle01-iframe";
import { Box, Button } from "@chakra-ui/react";
import axios from "axios";
import { useAccount } from "wagmi";

function Huddlecomp({roomID}) {
  const{address}=useAccount();

  const iframeConfig = {
    roomUrl: `https://iframe.huddle01.com/${roomID}`,
    height: "660px",
    width: "100%",
    noBorder: false, // false by default
  };

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

  
  useEffect(() => {
    // its preferable to use env vars to store projectId
    // createroom();
  }, []);

  return (
    <div>
      <HuddleIframe config={iframeConfig} />
    </div>
  );
}

export default Huddlecomp;
