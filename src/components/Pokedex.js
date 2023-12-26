import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, Text, Button, Flex } from '@chakra-ui/react';
import PokemonCard from './PokemonCard';
import { useNavigate } from 'react-router-dom';

const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const POKEMON_SPECIES_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon-species';
const LOCATION_API_BASE_URL = 'https://pokeapi.co/api/v2/location-area';

const Pokedex = ({ selectedGeneration, selectedTypes, selectedMove, searchTrigger }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const applyFilter = async () => {

      try {
        setLoadingData(true);
        let filteredPokemonList = [];

        // Filtro por geração, tipo e ataque
        if (selectedGeneration && selectedTypes.length > 0 && selectedMove) {
          const generationResponse = await axios.get(`https://pokeapi.co/api/v2/generation/${selectedGeneration}`);
          const generationPokemonNames = generationResponse.data.pokemon_species.map((pokemon) => pokemon.name);

          const typePromises = selectedTypes.map(async (type) => {
            try {
              const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
              return response.data.pokemon.map((pokemon) => pokemon.pokemon.name);
            } catch (error) {
              console.error('Error fetching Pokemon data:', error);
            }
          });

          const typePokemonNames = await Promise.all(typePromises);
          const commonPokemonNames = typePokemonNames.reduce((a, b) => a.filter(c => b.includes(c)));

          const commonPokemonInGeneration = commonPokemonNames.filter(name => generationPokemonNames.includes(name));

          const moveResponse = await axios.get(`https://pokeapi.co/api/v2/move/${selectedMove}`);
          const learnedByPokemon = moveResponse?.data?.learned_by_pokemon || [];
          const movePokemonNames = learnedByPokemon.map(pokemon => pokemon.name);

          filteredPokemonList = commonPokemonInGeneration.filter(name => movePokemonNames.includes(name));

          const pokemonPromises = filteredPokemonList.map(async (name) => {
            try {
              const pokemonSpeciesResponse = await axios.get(`${POKEMON_SPECIES_API_BASE_URL}/${name}`);
              const pokemonResponse = await axios.get(`${POKEMON_API_BASE_URL}/${pokemonSpeciesResponse.data.id}`);
              return pokemonResponse.data;
            } catch (error) {
              // Ignorar Pokémon não encontrado
              return null;
            }
          });

          filteredPokemonList = await Promise.all(pokemonPromises);
          filteredPokemonList = filteredPokemonList.filter(Boolean);
        } else if (selectedGeneration && selectedTypes.length > 0) {
          // geração e tipo de ataque
          const generationResponse = await axios.get(`https://pokeapi.co/api/v2/generation/${selectedGeneration}`);
          const generationPokemonNames = generationResponse.data.pokemon_species.map((pokemon) => pokemon.name);
        
          const typePromises = selectedTypes.map(async (type) => {
            try {
              const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
              return response.data.pokemon.map((pokemon) => pokemon.pokemon.name);
            } catch (error) {
              console.error('Error fetching Pokemon data:', error);
            }
          });
        
          const typePokemonNames = await Promise.all(typePromises);
          const commonPokemonNames = typePokemonNames.reduce((a, b) => a.filter(c => b.includes(c)));
        
          filteredPokemonList = commonPokemonNames.filter(name => generationPokemonNames.includes(name));
        
          const pokemonPromises = filteredPokemonList.map(async (name) => {
            try {
              const pokemonSpeciesResponse = await axios.get(`${POKEMON_SPECIES_API_BASE_URL}/${name}`);
              const pokemonResponse = await axios.get(`${POKEMON_API_BASE_URL}/${pokemonSpeciesResponse.data.id}`);
              return pokemonResponse.data;
            } catch (error) {
              return null;
            }
          });
        
          filteredPokemonList = await Promise.all(pokemonPromises);
          filteredPokemonList = filteredPokemonList.filter(Boolean);
        }else if (selectedGeneration &&  selectedMove) {
          //geração e ataque
          const generationResponse = await axios.get(`https://pokeapi.co/api/v2/generation/${selectedGeneration}`);
          const generationPokemonNames = generationResponse.data.pokemon_species.map((pokemon) => pokemon.name);
        
          const moveResponse = await axios.get(`https://pokeapi.co/api/v2/move/${selectedMove}`);
          const learnedByPokemon = moveResponse?.data?.learned_by_pokemon || [];
          const movePokemonNames = learnedByPokemon.map(pokemon => pokemon.name);
        
          filteredPokemonList = movePokemonNames.filter(name => generationPokemonNames.includes(name));
        
          const pokemonPromises = filteredPokemonList.map(async (name) => {
            try {
              const pokemonSpeciesResponse = await axios.get(`${POKEMON_SPECIES_API_BASE_URL}/${name}`);
              const pokemonResponse = await axios.get(`${POKEMON_API_BASE_URL}/${pokemonSpeciesResponse.data.id}`);
              return pokemonResponse.data;
            } catch (error) {
              return null;
            }
          });
        
          filteredPokemonList = await Promise.all(pokemonPromises);
          filteredPokemonList = filteredPokemonList.filter(Boolean);
        }else if (selectedTypes.length > 0 && selectedMove) {
            //tipo de ataque e ataque
          const moveResponse = await axios.get(`https://pokeapi.co/api/v2/move/${selectedMove}`);
          const learnedByPokemon = moveResponse?.data?.learned_by_pokemon || [];
          const movePokemonNames = learnedByPokemon.map(pokemon => pokemon.name);
        
          const typePromises = selectedTypes.map(async (type) => {
            try {
              const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
              return response.data.pokemon.map((pokemon) => pokemon.pokemon.name);
            } catch (error) {
              console.error('Error fetching Pokemon data:', error);
            }
          });
        
          const typePokemonNames = await Promise.all(typePromises);
          const commonPokemonNames = typePokemonNames.reduce((a, b) => a.filter(c => movePokemonNames.includes(c)));
        
          filteredPokemonList = commonPokemonNames.filter(name => movePokemonNames.includes(name));
        
          const pokemonPromises = filteredPokemonList.map(async (name) => {
            try {
              const pokemonSpeciesResponse = await axios.get(`${POKEMON_SPECIES_API_BASE_URL}/${name}`);
              const pokemonResponse = await axios.get(`${POKEMON_API_BASE_URL}/${pokemonSpeciesResponse.data.id}`);
              return pokemonResponse.data;
            } catch (error) {

              return null;
            }
          });
        
          filteredPokemonList = await Promise.all(pokemonPromises);
          filteredPokemonList = filteredPokemonList.filter(Boolean);
        }else if (selectedGeneration) {
          // Filtro por geração
          const response = await axios.get(`https://pokeapi.co/api/v2/generation/${selectedGeneration}`);
          const pokemonNamesByGeneration = response.data.pokemon_species.map(pokemon => pokemon.name);

          const pokemonPromises = pokemonNamesByGeneration.map(async (name) => {
            try {
              const pokemonSpeciesResponse = await axios.get(`${POKEMON_SPECIES_API_BASE_URL}/${name}`);
              const pokemonResponse = await axios.get(`${POKEMON_API_BASE_URL}/${pokemonSpeciesResponse.data.id}`);
              return pokemonResponse.data;
            } catch (error) {
              return null;
            }
          });

          filteredPokemonList = await Promise.all(pokemonPromises);
          filteredPokemonList = filteredPokemonList.filter(Boolean);
        } else if (selectedTypes.length > 0) {
          // Filtro por tipo
          const typePromises = selectedTypes.map(async (type) => {
            try {
              const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
              return response.data.pokemon.map((pokemon) => pokemon.pokemon.name);
            } catch (error) {
              console.error('Error fetching Pokemon data:', error);
            }
          });

          const pokemonNamesByType = await Promise.all(typePromises);
          const commonPokemonNames = pokemonNamesByType.reduce((a, b) => a.filter(c => b.includes(c)));

          const pokemonPromises = commonPokemonNames.map(async (name) => {
            try {
              const pokemonSpeciesResponse = await axios.get(`${POKEMON_SPECIES_API_BASE_URL}/${name}`);
              const pokemonResponse = await axios.get(`${POKEMON_API_BASE_URL}/${pokemonSpeciesResponse.data.id}`);
              return pokemonResponse.data;
            } catch (error) {
              return null;
            }
          });

          filteredPokemonList = await Promise.all(pokemonPromises);
          filteredPokemonList = filteredPokemonList.filter(Boolean);
        } else if (selectedMove) {
          // Filtro por ataque
          try {
            const moveResponse = await axios.get(`https://pokeapi.co/api/v2/move/${selectedMove}`);
            const learnedByPokemon = moveResponse?.data?.learned_by_pokemon || [];
            const movePokemonNames = learnedByPokemon.map(pokemon => pokemon.name);
        
            const pokemonPromises = movePokemonNames.map(async (name) => {
              try {
                const pokemonSpeciesResponse = await axios.get(`${POKEMON_SPECIES_API_BASE_URL}/${name}`);
                const pokemonResponse = await axios.get(`${POKEMON_API_BASE_URL}/${pokemonSpeciesResponse.data.id}`);
                return pokemonResponse.data;
              } catch (error) {
                return null;
              }
            });
        
            filteredPokemonList = await Promise.all(pokemonPromises);
            filteredPokemonList = filteredPokemonList.filter(Boolean);
          } catch (error) {
            console.error('Error fetching Pokemon data:', error);
          }
        }

        setPokemonList(filteredPokemonList.sort((a, b) => a.id - b.id)); // ordena em ordem crescente
        
        // Retorna as localizações dos pokemons do filtro
        const locationPromises = filteredPokemonList.map(async (pokemon) => {
          try {
            const locationResponse = await axios.get(`${POKEMON_API_BASE_URL}/${pokemon.id}/encounters`);
            const locationAreas = locationResponse?.data?.map((location) => location.location_area) || [];
        
            return locationAreas.map((area) => ({ name: area.name, url: area.url }));
          } catch (error) {
            console.error('Error fetching location data:', error);
            return [];
          }
        });
        
        const locationData = await Promise.all(locationPromises);
        
        const locationObjects = locationData.flat();
        
        const uniqueLocationObjects = Array.from(new Set(locationObjects.map(JSON.stringify)), JSON.parse);
        
        setLocations(uniqueLocationObjects);
       
        
        } catch (error) {
          console.error('Error fetching Pokemon data:', error);
        } finally {
          setLoadingData(false);
        }
    };

    applyFilter();
    // eslint-disable-next-line
  }, [searchTrigger]);

  useEffect(() => {
    if (selectedTypes.length === 0 && !selectedGeneration && !selectedMove) {
      // Se nenhum filtro estiver ativado, retorne para a home
      navigate('/');
    }
  }, [selectedTypes, selectedGeneration, selectedMove, navigate]);

  const handleLocationClick = async (location) => {
    try {
      const { name, url } = location;
      const locationId = url.split('/').filter(Boolean).pop();
  
      // Obter dados da localização
      const locationResponse = await axios.get(`${LOCATION_API_BASE_URL}/${locationId}`);
      const locationData = locationResponse?.data || {};

      // Extrair a lista de pokemons encontrados na area
      const locationAreas = locationData.pokemon_encounters || [];

      // Extrair IDs dos Pokémon na localização
      const locationPokemonIds = locationAreas.flatMap((encounter) => {
        const pokemonUrl = encounter.pokemon?.url;

        const pokemonId = pokemonUrl?.split('/').filter(Boolean).pop();
        return pokemonId ? parseInt(pokemonId, 10) : null;
      }).filter(Boolean);
  
      // Filtrar a lista de Pokémon existente usando os IDs dos Pokémon na localização
      const pokemonListInLocation = pokemonList.filter((pokemon) => locationPokemonIds.includes(pokemon.id));

  
      // Adicionar os Pokémon da localidade à lista existente
      setPokemonList(pokemonListInLocation);
      setSelectedLocation(name);
  
  
    } catch (error) {
      console.error('Erro ao buscar detalhes da localização:', error);
    }
  };

  const handleBackButtonClick = () => {
    setPokemonList([]);
    setSelectedLocation(null);
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      
      minHeight="100vh"
      padding="1rem"
      bgColor="#f5f5f5"
    >
      <Box
        maxWidth="1200px"
        width="100%"
        bgColor="#ffffff"
        borderRadius="md"
        padding="2rem"
        marginTop="2rem"
        boxShadow="md"
      >
        {loadingData ? (
          <Text mt={4} fontSize="xl" fontWeight="bold" color="teal.600">
            Carregando dados...
          </Text>
        ) : selectedLocation ? (
          <>
            <Text mt={2} fontSize="2xl" fontWeight="bold" color="teal.600" padding={"1rem"}>
              {`Pokémons encontrados em ${selectedLocation}`}
            </Text>
            <Grid templateColumns={`repeat(4, 1fr)`} gap={4} flexWrap={'wrap'}>
              {pokemonList.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  number={pokemon.id}
                  name={pokemon.name}
                  pokeDetails={pokemon}
                  image={pokemon.sprites.front_default}
                />
              ))}
            </Grid>
            <Button onClick={handleBackButtonClick} mt={4} colorScheme="teal">
              Voltar para a lista de localidades
            </Button>
          </>
        ) : locations.length > 0 ? (
          <>
            <Text mt={2} fontSize="2xl" fontWeight="bold" color="teal.600" padding={"1rem"}>
              Escolha uma localização
            </Text>
            <Grid templateColumns={`repeat(${Math.min(locations.length, 4)}, 1fr)`} gap={4}>
              {locations.map((location) => (
                <Box
                  key={location.url}
                  p={4}
                  bgColor="gray.200"
                  borderRadius="md"
                  textAlign="center"
                  _hover={{ bgColor: 'teal.200', cursor: 'pointer', transform: 'scale(1.05)' }}
                  onClick={() => handleLocationClick(location)}
                >
                  <Text mb={2}>{location.name}</Text>
                </Box>
              ))}
            </Grid>
          </>
        ) : (
          <Text mt={4} fontSize="xl" fontWeight="bold" color="red.500">
            Nenhum Pokémon corresponde à sua pesquisa!
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default Pokedex;