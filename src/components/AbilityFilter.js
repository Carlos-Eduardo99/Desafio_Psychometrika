import React, { useState, useEffect } from 'react';
import { Box, Select, Text } from '@chakra-ui/react';
import axios from 'axios';

const AbilityFilter = ({ onSelectAbility }) => {
  const [abilities, setAbilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbilities = async () => {
      try {
        let allAbilities = [];
        let nextUrl = 'https://pokeapi.co/api/v2/ability/';

        // Continue fazendo solicitações até que não haja mais resultados
        while (nextUrl) {
          const response = await axios.get(nextUrl);
          const abilitiesData = response.data.results.map((ability) => ({
            value: ability.url.split('/').reverse()[1],
            label: ability.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          }));
          allAbilities = [...allAbilities, ...abilitiesData];
          nextUrl = response.data.next; // Próxima página de resultados
        }

        // Ordena as habilidades em ordem alfabética
        const sortedAbilities = allAbilities.slice().sort((a, b) => a.label.localeCompare(b.label));
        
        setAbilities(sortedAbilities);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching abilities:', error);
        setLoading(false);
      }
    };

    fetchAbilities();
  }, []);

  const handleSelectChange = (e) => {
    const selectedAbility = e.target.value;
    onSelectAbility(selectedAbility);
  };

  return (
    <Box mb="4" p="4" bgColor="#f7fafc" rounded="md" boxShadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={2} color="#2d3748">
        Habilidade
      </Text>
      {loading ? (
        <p>Carregando habilidades...</p>
      ) : (
        <Select placeholder="Selecione uma habilidade" onChange={handleSelectChange} color="#4a5568">
          {abilities.map((ability) => (
            <option key={ability.value} value={ability.value}>
              {ability.label}
            </option>
          ))}
        </Select>
      )}
    </Box>
  );
};

export default AbilityFilter;