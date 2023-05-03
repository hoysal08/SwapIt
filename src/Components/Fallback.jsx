import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useAccount } from "wagmi";

function Fallback() {
  const { address } = useAccount();
  return (
    <div>
      {address === undefined && (
        <Flex alignItems="center" pt="15%" justify="center">
          <Text color="#454545" fontSize="2xl" as="b">
            Please Connect your wallet, To proceed
          </Text>
        </Flex>
      )}
    </div>
  );
}

export default Fallback;
