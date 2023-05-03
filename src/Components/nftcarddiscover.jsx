import { Badge, Box, Button, Flex, Image } from '@chakra-ui/react'
import React from 'react'
import img_error from "../Assets/img_error.png"
import { useNavigate } from 'react-router-dom'

function nftcarddiscover({NFTobj}) {

    function formatcontractaddress(address){
      return  NFTobj?.contract.address.substring(0,4)+"...."+NFTobj?.contract.address.slice(-4)
    }

    

  return (
    <div>
        <Box maxW="sm" minH="lg"  borderWidth='3px' borderRadius='2xl' boxShadow="dark-lg" overflow='hidden' boxSize="sm" my="1%" backgroundColor="#191825"> 
         <Image boxSize="xs" ml="6%" pl="3%" my="2%"  src={NFTobj?.media[0]?.thumbnail || NFTobj?.media[0]?.gateway || NFTobj?.tokenUri?.gateway || img_error} alt={"NFT image"} />
         <Box px='6' py='2' >
            <Box display='flex' alignItems="baseline">
                <Badge borderRadius='full' px='2' colorScheme="orange">
                    {NFTobj?.balance}
                </Badge>
                <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            fontSize='xs'
            textTransform='uppercase'
            ml='2'
          >
            {formatcontractaddress(NFTobj?.contract.address)}  &bull; #{NFTobj?.tokenId} 
          </Box>
        </Box>
        <Box
          mt='1'
          fontWeight='semibold'
          as='samp'
          lineHeight='tight'
          noOfLines={1}
          color='gray.500'
        >
          {NFTobj?.contract?.name || "Name" } &bull; {NFTobj?.contract?.symbol || "Symbol" }
        </Box>
        <Flex direction="column"  >
        <Button my="3%" backgroundColor="#191825" color="#E384FF" variant="outline" colorScheme="#E384FF">Swap</Button>
        <Button  backgroundColor="#191825" color="#E384FF" variant="outline" colorScheme="#E384FF" onClick={navigate=("/connect")} >Connect</Button>
        </Flex>
         </Box>
        </Box>
    </div>
  )
}

export default nftcarddiscover