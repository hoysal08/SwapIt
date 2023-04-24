import { Card, Flex } from '@chakra-ui/react'
import React from 'react'
import NftCard from './NftCard'

function NftCardHolder({nftarray}) {
  return (
    <div>
        <Flex direction="row" justify="space-evenly" m="15">
            {
          nftarray.map((nftobj,i)=><NftCard key={i} NFTobj={nftobj}/>)
            }
        </Flex>
    </div>
  )
}

export default NftCardHolder