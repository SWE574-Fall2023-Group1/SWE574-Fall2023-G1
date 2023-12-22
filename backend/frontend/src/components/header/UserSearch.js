import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, IconButton, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

function UserSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 0) {
        try {
          const response = await axios.get(
            `http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/searchUser?search=${searchQuery}`,
            { withCredentials: true }
          );
          setSuggestions(response.data.users);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Delay for 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    navigate(`/SearchUserResults/${searchQuery}`);
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Autocomplete
        options={suggestions}
        getOptionLabel={(option) => option.username}
        inputValue={searchQuery}
        onInputChange={(event, newValue) => {
          setSearchQuery(newValue);
        }}
        renderInput={(params) => (
          <TextField
      {...params}
      placeholder="Search usernames..."
      autoComplete="true"
      onKeyPress={handleKeyPress}
      size="small"
      variant="outlined"
      style={{
        backgroundColor: 'white',
        borderRadius: '4px',
        width: '15vw',
        fontFamily: "'Josefin Sans', sans-serif",
      }}
    />
        )}
      />
      <div
  onClick={handleSearch}
  style={{
    width: 70,
    height: 40,
    paddingLeft: 5,
    paddingRight: 5,
    background: '#7E49FF',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderRadius : 5,
    display: 'inline-flex',
    cursor: 'pointer', // Add this to make it look clickable
    marginLeft: "10px",
    marginRight: "10px",
  }}
>
  <div style={{color: 'white', fontSize: 15, fontFamily: "'Josefin Sans', sans-serif", fontWeight: '400', lineHeight: 22, wordWrap: 'break-word' }}>
    Search
  </div>
</div>
    </div>
  );
}

export default UserSearch;
