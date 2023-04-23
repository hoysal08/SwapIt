import { Box, Icon, Text } from '@chakra-ui/react'
import React from 'react'
import {WarningTwoIcon} from "@chakra-ui/icons"

function NoNfts() {
  return (
    <div >
        <Box minH="100vh" align="center" pt="10%" minW="100vw">
                 <Text fontSize="5xl" as='samp'>
                    No Cool NFT's here
                 </Text>
                 <Icon as={WarningTwoIcon} mx="5" boxSize="10" mb="5"/>
        </Box>
    </div>
  )
}

export default NoNfts