import React from 'react';
import { Heading, Box } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box bgColor="#2d3748" p={4} mb={4}>
      <Box maxW="1200px" mx="auto">
        <Heading as="h1" size="xl" textAlign="center" color="white">
          🚀 Desafio Pokedex - Psychometrika 🚀
        </Heading>
      </Box>
    </Box>
  );
};

export default Header;