import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useAccount } from "wagmi";

function Fallback() {
  const { address } = useAccount();
  return (
    <div >
      {address === undefined && (
        <Box  backgroundColor="#ECC9EE" h="88vh">
         <Flex alignItems="center" pt="15%" justify="center">
          <Text color="#454545" fontSize="2xl" as="b">
            Please Connect your wallet, To proceed
          </Text>
        </Flex> 
        </Box>
        
      )}
    </div>
  );
}

export default Fallback;
