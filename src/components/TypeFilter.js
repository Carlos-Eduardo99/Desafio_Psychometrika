import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, VStack, Text } from '@chakra-ui/react';

const typeColors = {
  normal: '#a6a877',
  grass: '#56d0b0',
  fire: '#f36a6c',
  water: '#77befc',
  electric: '#ffd76f',
  ice: '#98d5d7',
  ground: '#dfbf69',
  flying: '#a98ff0',
  poison: '#a040a0',
  fighting: '#bf3029',
  psychic: '#f65687',
  dark: '#725847',
  rock: '#b8a137',
  bug: '#a8b720',
  ghost: '#6e5896',
  steel: '#b9b7cf',
  dragon: '#6f38f6',
  fairy: '#f9aec7',
};

const TypeFilter = ({ onSelectType }) => {
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/type');
        const typeList = response.data.results.map((type) => type.name).filter((type) => type !== 'unknown' && type !== 'shadow');
        setTypes(typeList);
      } catch (error) {
        console.error('Error fetching Pokemon types:', error);
      }
    };

    fetchTypes();
  }, []);

  const handleTypeClick = (type) => {
    const updatedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((selectedType) => selectedType !== type)
      : [...selectedTypes, type];

    setSelectedTypes(updatedTypes);
    onSelectType(updatedTypes);
  };

  return (
    <Box mt={4} p={4} bgColor="rgba(255, 255, 255, 0.8)" rounded="md" border="1px solid #ccc" mx="auto" maxW="600px">
      <Text fontSize="2xl" fontWeight="bold" mb={2} letterSpacing="wide">
        Tipos de Ataque
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={5}>
        {types.map((type) => (
          <Box
            key={type}
            onClick={() => handleTypeClick(type)}
            p={4}
            bgColor={selectedTypes.includes(type) ? typeColors[type] : 'gray.200'}
            rounded="md"
            cursor="pointer"
            _hover={{ bgColor: selectedTypes.includes(type) ? typeColors[type] : 'gray.300' }}
          >
            <VStack spacing={1}>
              <Text color={selectedTypes.includes(type) ? 'white' : 'gray.600'} fontSize="lg">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </VStack>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default TypeFilter;