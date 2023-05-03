import React, { useEffect, useState } from "react";
import { useHuddle01 } from "@huddle01/react";
import { HuddleIframe, IframeConfig } from "@huddle01/huddle01-iframe";
import { Box, Button } from "@chakra-ui/react";
import axios from "axios";
import { useAccount } from "wagmi";

function Huddlecomp({ roomID }) {
  const { address } = useAccount();

  const iframeConfig = {
    roomUrl: `https://iframe.huddle01.com/${roomID}`,
    height: "660px",
    width: "100%",
    noBorder: false, // false by default
  };

  return (
    <div>
      <HuddleIframe config={iframeConfig} />
    </div>
  );
}

export default Huddlecomp;
