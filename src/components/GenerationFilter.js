import React, { useEffect, useState } from 'react';
import { Box, Select, Text } from '@chakra-ui/react';
import axios from 'axios';

const GenerationFilter = ({ onSelectGeneration }) => {
  const [generations, setGenerations] = useState([]);

  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/generation/');
        const genData = response.data.results.map((gen) => ({
          value: gen.url.split('/').reverse()[1],
          label: gen.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()), // Capitaliza as palavras
        }));
        setGenerations(genData);
      } catch (error) {
        console.error('Error fetching generations:', error);
      }
    };

    fetchGenerations();
  }, []);

  const handleSelectChange = (e) => {
    const selectedGeneration = e.target.value;
    onSelectGeneration(selectedGeneration);
  };

  return (
    <Box mb="4" p="4" bgColor="#f7fafc" rounded="md" boxShadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={2} color="#2d3748">
        Geração
      </Text>
      <Select placeholder="Selecione uma geração" onChange={handleSelectChange} color="#4a5568">
        {generations.map((generation) => (
          <option key={generation.value} value={generation.value}>
            {generation.label}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default GenerationFilter;