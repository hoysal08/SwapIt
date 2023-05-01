import React, { useEffect, useState } from 'react'
import { useAccount, useSigner, useSwitchNetwork,useNetwork } from 'wagmi'
import { Chat } from "@pushprotocol/uiweb";
import * as PushAPI from "@pushprotocol/restapi"

function PushComp() {


  const{address}=useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork()
  const[dummyreceiver,setdummy]=useState("0x68be6B45425152c971F26764E67124480C066adf")
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
    conversationId: `eip155:${dummyreceiver}`,
    env:'staging' // receiver's address or chatId of a group
  });
  
  // console.log(conversationHash)
// actual api

const chatHistory = await PushAPI.chat.history({
threadhash: conversationHash.threadHash,
account: `eip155:${dummyreceiver}`,
limit: 10,
toDecrypt: true,
pgpPrivateKey: pgpDecryptedPvtKey,
env: 'staging'
});

// console.log(chatHistory);
} 
const themeee = {
  bgColorPrimary: 'gray',
  bgColorSecondary: 'purple',
  textColorPrimary: 'white',
  textColorSecondary: 'green',
  btnColorPrimary: 'red',
  btnColorSecondary: 'purple',
  border: '1px solid black',
  borderRadius: '40px',
  moduleColor: 'pink',
};
useEffect(()=>{
if(address!=undefined && signer!=undefined){
  // fetchchats();
}
},[address,signer])

useEffect(()=>{
  if(address=='0x68be6B45425152c971F26764E67124480C066adf'){
    setdummy("0x73FF456F43Beb9Be727C5cb998Ed00B40cE55d1E")
  }
},[address])

  return (
    <div>
      <Chat
   account={address} //user address
   supportAddress={dummyreceiver} //support address
   env="staging"
   greetingMsg={null}
   theme={themeee}
   modalTitle="Let's Swap-It"
 />
    </div>
  )
}

export default PushComp