import { Card, Flex } from '@chakra-ui/react'
import React from 'react'
import NftCard from './NftCard'

function NftCardHolder(props) {
  let nftarray=props?.nftarray
  let discoverpage=props?.discover;
  let swapid=props?.swapId

  return (
    <div>
        <Flex direction="row" justify="space-evenly" m="15">
            {
          nftarray.map((nftobj,i)=><NftCard key={i} NFTobj={nftobj} discover={discoverpage} swapId={swapid}/>)
            }
        </Flex>
    </div>
  )
}

export default NftCardHolder