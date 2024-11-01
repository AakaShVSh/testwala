import { Box, Button, Collapse, Grid, GridItem, Input, Text, useDisclosure } from "@chakra-ui/react";
import { MdAddBox } from "react-icons/md";

function CollapseEx() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Button mt="2" onClick={onToggle}>
        Create a Test <MdAddBox />
      </Button>
      <Collapse in={isOpen} animateOpacity>
        <Box
          p="10px"
          //   color="white"
          mt="2"
          bg="white"
          rounded="md"
          shadow="md"
        >
          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(2, 1fr)"
            gap={3}
          >
            {/* <Lorem count={1} /> */}
            <GridItem>
              <Text mb="3px">Test Name</Text>
              <Input
                // value={"select"}
                defaultValue="Test 1"
                // onChange={"handleChange"}
                placeholder="Here is a sample placeholder"
                size="sm"
              />
            </GridItem>
            <GridItem>
              <Text mb="3px">Test Name</Text>
              <Input
                // value={"select"}
                // onChange={"handleChange"}
                placeholder="Here is a sample placeholder"
                size="sm"
              />
            </GridItem>
            <GridItem>
              <Text mb="3px">Test Name</Text>
              <Input
                // value={"select"}
                // onChange={"handleChange"}
                placeholder="Here is a sample placeholder"
                size="sm"
              />
            </GridItem>
          </Grid>
        </Box>
      </Collapse>
    </>
  );
}

export default CollapseEx;