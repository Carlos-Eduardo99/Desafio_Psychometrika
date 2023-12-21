import React from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';
import TypeFilter from './TypeFilter';
import GenerationFilter from './GenerationFilter';

const Filter = ({ onSelectGeneration, onSelectType }) => {
  const handleTypeSelect = (types) => {
    onSelectType(types);
  };

  return (
    <Box
      maxW="1000px"
      mx="auto"
      mt={4}
      p={4}
      borderRadius="md"
      bgColor="#f8fafc"
      boxShadow="md"
      borderWidth="1px"
      borderColor="#cbd5e0"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4} textAlign="center">
        Filtros
      </Text>
      <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'stretch', md: 'center' }}>
        <Box flex={{ base: '1', md: '2' }} mb={{ base: '4', md: '0' }}>
          <TypeFilter onSelectType={handleTypeSelect} />
        </Box>
        <Box ml={{ base: '0', md: '4' }}>
          <GenerationFilter onSelectGeneration={onSelectGeneration} />
        </Box>
      </Flex>
    </Box>
  );
};

export default Filter;