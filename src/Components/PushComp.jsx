import React, { useEffect, useState } from "react";
import { useAccount, useSigner, useSwitchNetwork, useNetwork } from "wagmi";
import { Chat } from "@pushprotocol/uiweb";
import * as PushAPI from "@pushprotocol/restapi";

function PushComp(props) {
  const buyerr = props.reciever;
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const [reciever, setdummy] = useState(buyerr);
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const themeee = {
    bgColorPrimary: "white",
    bgColorSecondary: "white",
    textColorPrimary: "#191825",
    textColorSecondary: "#191825",
    btnColorPrimary: "#E384FF",
    btnColorSecondary: "purple",
    border: "2px solid #191825",
    borderRadius: "40px",
    moduleColor: "#FFA3FD",
  };

  return (
    <div>
      <Chat
        account={address} //user address
        supportAddress={reciever} //support address
        env="staging"
        greetingMsg="Let's Huddle?"
        theme={themeee}
        modalTitle="Let's Swap-It"
      />
    </div>
  );
}

export default PushComp;
