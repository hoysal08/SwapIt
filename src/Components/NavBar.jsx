import { Flex, Grid, Box, Text, Image, Spacer } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Assets/logo_swapit.png"

function NavBar() {
  const navigate = useNavigate();
  return (
    <div>
      <Flex
        px="2%"
        w="100vw"
        height={["12vh"]}
        backgroundColor="#191825"
        direction="row"
        align="center"
        justify="space-between"
      >
        <Box onClick={() => {
                navigate("/");
              }}>
          <Flex direction="row" justify={"flex-start"} _hover={{ color: "#E384CF", cursor: "pointer" }}>
            <Image w="40px" h="40px" src={logo} mr="10px"/>
          <Text color="#E384FF" as="samp" fontSize="2xl">
            TokenTalk
          </Text> 
          </Flex>
         
        </Box>
        <Box w="40vw">
          <Flex direction="row" align="center" justifyContent="space-evenly">
            <Text
              color="#E384FF"
              as={window.location.pathname === "/swaps" ? "b" : "samp"}
              fontSize="xl"
              _hover={{ color: "#E384CF", cursor: "pointer" }}
              onClick={() => {
                navigate("/swaps");
              }}
            >
              Open-Swaps
            </Text>
            <Text
              color="#E384FF"
              as={window.location.pathname === "/discover" ? "b" : "samp"}
              fontSize="xl"
              _hover={{ color: "#E384CF", cursor: "pointer" }}
              onClick={() => {
                navigate("/discover");
              }}
            >
              Discover
            </Text>
            <Text
              color="#E384FF"
              as={window.location.pathname === "/myassets" ? "b" : "samp"}
              fontSize="xl"
              _hover={{ color: "#E384CF", cursor: "pointer" }}
              onClick={() => {
                navigate("/myassets");
              }}
            >
              Your assets
            </Text>
          </Flex>
        </Box>
        <Box>
          <ConnectButton showBalance={false} chainStatus="icon" />
        </Box>
      </Flex>
    </div>
  );
}

export default NavBar;
