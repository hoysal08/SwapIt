import React, { useEffect, useState } from 'react'
import { useAccount, useSigner, useSwitchNetwork,useNetwork } from 'wagmi'
import { Chat } from "@pushprotocol/uiweb";
import * as PushAPI from "@pushprotocol/restapi"

function PushComp(props) {


  const buyerr=props.reciever;
  const{address}=useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork()
  const[reciever,setdummy]=useState(buyerr)
  const { chains, error, isLoading, pendingChainId, switchNetwork } =useSwitchNetwork()


 async function fetchchats(){

  // console.log(signer)
  // console.log(address)
  
let user = await PushAPI.user.get({
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

  
  // get threadhash, this will fetch the latest conversation hash
  // you can also use older conversation hash (called link) by iterating over to fetch more historical messages
  // conversation hash are also called link inside chat messages
  const conversationHash = await PushAPI.chat.conversationHash({
    account: `eip155:${address}`,
    conversationId: `eip155:${reciever}`,
    env:'staging' // receiver's address or chatId of a group
  });
  
  // console.log(conversationHash)
// actual api

const chatHistory = await PushAPI.chat.history({
threadhash: conversationHash.threadHash,
account: `eip155:${reciever}`,
limit: 10,
toDecrypt: true,
pgpPrivateKey: pgpDecryptedPvtKey,
env: 'staging'
});

// console.log(chatHistory);
} 
const themeee = {
  bgColorPrimary: 'white',
  bgColorSecondary: 'white',
  textColorPrimary: '#191825',
  textColorSecondary: '#191825',
  btnColorPrimary: '#E384FF',
  btnColorSecondary: 'purple',
  border: '2px solid #191825',
  borderRadius: '40px',
  moduleColor: '#FFA3FD',
};
useEffect(()=>{
if(address!=undefined && signer!=undefined){
  // fetchchats();
}
},[address,signer])

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
  )
}

export default PushComp