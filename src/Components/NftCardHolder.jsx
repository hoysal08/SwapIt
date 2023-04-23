import { Card, Flex } from '@chakra-ui/react'
import React from 'react'
import NftCard from './NftCard'

function NftCardHolder({nftarray}) {
    console.log(nftarray)
  return (
    <div>
        <Flex direction="row" justify="space-evenly" m="15">
            {
          nftarray.map((nftobj)=><NftCard NFTobj={nftobj}/>)
            }
        </Flex>
    </div>
  )
}

export default NftCardHolder