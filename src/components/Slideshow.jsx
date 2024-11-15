import { Box, Flex, Image } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";

const Carousel = () => {
  // Sample array of image URLs
  const images = [
    "https://www.nism.ac.in/wp-content/uploads/2024/07/1600-1-4.jpg",
    "https://www.nism.ac.in/wp-content/uploads/2024/07/1600-1-4.jpg",
    "https://www.nism.ac.in/wp-content/uploads/2024/07/1600-1-4.jpg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = images.length;
  const autoSlideInterval = 3000;
  const startX = useRef(0);
  const isDragging = useRef(false);

  const nextSlide = () => {
    setCurrentSlide((s) => (s === slidesCount - 1 ? 0 : s + 1));
  };

  // Auto-slide effect
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  // Slide container style for translating images
  const carouselStyle = {
    display: "flex",
    transition: "transform 0.5s ease-in-out",
    transform: `translateX(-${currentSlide * 100}%)`,
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    startX.current = e.clientX || e.touches[0].clientX; // Handle touch events
    isDragging.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const clientX = e.clientX || e.touches[0].clientX; // Handle touch events
    const diffX = startX.current - clientX;

    // If dragged sufficiently, decide to switch slide
    if (diffX > 50) {
      nextSlide();
      isDragging.current = false; // Stop dragging
    } else if (diffX < -50) {
      setCurrentSlide((s) => (s === 0 ? slidesCount - 1 : s - 1));
      isDragging.current = false; // Stop dragging
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <Flex
      w="90%" 
      m="auto"
      mt="2%"
      overflow="hidden"
      pos="relative"
      alignItems="center"
      justifyContent="center"
      direction="column"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves
      onTouchStart={handleMouseDown} // Touch event for mobile
      onTouchMove={handleMouseMove} // Touch event for mobile
      onTouchEnd={handleMouseUp} // Touch event for mobile
    >
      {/* Image Slide Container */}
      <Box w="full" h={{ base: "250px",  md: "400px" }} overflow="hidden" borderRadius="2px">
        <Flex {...carouselStyle}>
          {images.map((src, index) => (
            <Box key={index} boxSize="full" flex="none">
              <Image
                src={src}
                draggable="false" 
                alt={`Slide ${index}`}
                objectFit="cover"
                w="full"
                h={{ base: "250px", md: "400px" }} // Responsive height
              />
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Dots for navigation */}
      <Flex justify="center" mt={4}>
        {images.map((_, index) => (
          <Box
            key={index}
            cursor="pointer"
            boxSize="15px"
            m="0 5px"
            borderRadius="full"
            bg={currentSlide === index ? "gray.800" : "gray.400"}
            onClick={() => setCurrentSlide(index)}
            transition="background-color 0.3s ease-in-out"
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default Carousel;
