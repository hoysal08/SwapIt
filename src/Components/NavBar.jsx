import { Flex, Grid,Box,Text } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function NavBar() {
 
  const navigate=useNavigate()

  return (
    <div>
        <Flex px="2%" w="100vw" height={["12vh"]} backgroundColor="#191825" direction="row" align="center" justify="space-between">
          <Box>
          <Text color="#E384FF" as='samp' fontSize="2xl">SwapIt</Text>
          </Box>
          <Box w="40vw">
          <Flex direction="row"  align="center" justifyContent="space-evenly">
                <Text color="#E384FF" as='samp' fontSize="xl" _hover={{ color:"#E384CF",cursor:"pointer" }} onClick={()=>{navigate("/swaps")}}>Open-Swaps</Text> 
                <Text color="#E384FF" as='samp' fontSize="xl" _hover={{ color:"#E384CF",cursor:"pointer" }} onClick={()=>{navigate("/discover")}}>Discover</Text>
                <Text color="#E384FF" as='samp' fontSize="xl" _hover={{ color:"#E384CF",cursor:"pointer" }} onClick={()=>{navigate("/myassets")}}>Your assets</Text>
          </Flex>
          </Box>
          <Box >
           <ConnectButton showBalance={false} chainStatus="icon"/>
          </Box>
        </Flex>
    </div>
  )
  
}

export default NavBar