import { Box, Icon, Text } from '@chakra-ui/react'
import React from 'react'
import {WarningTwoIcon} from "@chakra-ui/icons"

function NoNfts(props) {
 let discoverpage=props?.discover
 let text=props?.text
 if(text===undefined){
  text="No Cool NFT's here"
 }
  return (
    <div >
        <Box minH={discoverpage?"50vh":"100vh"} align="center" pt="10%" minW={discoverpage?"50vw":"100vw"}>
                 <Text fontSize="5xl" as='samp'>
                   {text}
                 </Text>
                 <Icon as={WarningTwoIcon} mx="5" boxSize="10" mb="5"/>
        </Box>
    </div>
  )
}

export default NoNfts