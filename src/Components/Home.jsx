import { Box, Image } from '@chakra-ui/react'
import React from 'react'
import poster from "../Assets/home_poster.gif"

function Home() {
  return (
    <div>
        <Box >
          <Image w="100vw" h="88vh" src={poster} >
        </Image>  
        </Box>
        
    </div>
  )
}

export default Home