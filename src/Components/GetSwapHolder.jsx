import React from "react";
import GetSwap from "./GetSwap";
import { Flex } from "@chakra-ui/react";

function GetSwapHolder({ props }) {
  return (
    <div>
      <Flex direction="row" justify="space-evenly" m="15">
        {props.map((e, i) => (
          <GetSwap key={i} props={e} />
        ))}
      </Flex>
    </div>
  );
}

export default GetSwapHolder;
