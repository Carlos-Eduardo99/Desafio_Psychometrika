import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Box, Text, Button, Spinner } from '@chakra-ui/react';
import TypeFilter from './TypeFilter';
import GenerationFilter from './GenerationFilter';
import MoveFilter from './MoveFilter';

const Filter = ({ onSelectGeneration, onSelectType, onSelectMove, onSearch, loading }) => {
  const navigate = useNavigate();

  const handleTypeSelect = (types) => {
    onSelectType(types);
  };

  const handleSearch = () => {
    onSearch((prev) => !prev);

    navigate('/pokedex');
  };

  return (
    <Box
      maxW="1500px"
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
      <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'stretch', md: 'center' }} minH={'300px'}>
        <Box flex={{ base: '1', md: '2' }} mb={{ base: '4', md: '0' }}>
          <TypeFilter onSelectType={handleTypeSelect} />
        </Box>
        <Box ml={{ base: '0', md: '4' }} gap={'100px'}>
          <GenerationFilter onSelectGeneration={onSelectGeneration} />
          <MoveFilter onSelectMove={onSelectMove} />
          <Flex justifyContent={'flex-end'} > 
          <Button onClick={handleSearch} colorScheme="teal" mt={4} disabled={loading}>
            {loading ? <Spinner size="sm" color="white" /> : 'Aplicar Filtro'}
          </Button>
        </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Filter;