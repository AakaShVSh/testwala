import { Box, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import React from "react";

const Footer = () => {
  return (
    <>
      <Box w={"100%"} display={"flex"} border={"1px solid red"} h={"250px"}>
        <UnorderedList styleType="'-'">
          <Text>About Us</Text>
          <ListItem>Lorem ipsum dolor sit amet</ListItem>
          <ListItem>Consectetur adipiscing elit</ListItem>
          <ListItem>Integer molestie lorem at massa</ListItem>
          <ListItem>Facilisis in pretium nisl aliquet</ListItem>
        </UnorderedList>{" "}
        <UnorderedList styleType="'-'">
          <Text></Text>
          <ListItem>Lorem ipsum dolor sit amet</ListItem>
          <ListItem>Consectetur adipiscing elit</ListItem>
          <ListItem>Integer molestie lorem at massa</ListItem>
          <ListItem>Facilisis in pretium nisl aliquet</ListItem>
        </UnorderedList>{" "}
        <UnorderedList styleType="'-'">
          <Text>Legal</Text>
          <ListItem>Lorem ipsum dolor sit amet</ListItem>
          <ListItem>Consectetur adipiscing elit</ListItem>
          <ListItem>Integer molestie lorem at massa</ListItem>
          <ListItem>Facilisis in pretium nisl aliquet</ListItem>
        </UnorderedList>
      </Box>
    </>
  );
};

export default Footer;
