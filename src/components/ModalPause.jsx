import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";

const ModalPause = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = useState("md");
  return (
    <>
      <Button onClick={onOpen} key={"xl"} border={"1px solid #01bfbd"} color={"#01bfbd"}>
        Pause
      </Button>
      <Modal onClose={onClose} size={"xl"} isOpen={isOpen}>
        <ModalOverlay/>
        <ModalContent>
        <ModalBody>
            Are you sure you want to pause
        </ModalBody>
        <ModalFooter>
            <Button mr={"2%"} onClick={onClose}>
                No
                </Button><Button>
                    Yes
                </Button>
        </ModalFooter></ModalContent>
      </Modal>
    </>
  );
};

export default ModalPause;
