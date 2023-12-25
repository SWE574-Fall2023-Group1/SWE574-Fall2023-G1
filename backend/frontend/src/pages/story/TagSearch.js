import React, { useState } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'; // For custom font styling
import Box from '@mui/material/Box'; // For layout styling

function TagSearch({ onTagSelect, currentTheme }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [userLabel, setUserLabel] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);
    const [tagDescription, setTagDescription] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSearchChange = async (event, value, reason) => {
        if (reason === 'input') {
            setSearchTerm(value);
            if (value.length > 2) {
                const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/wikidataSearch?query=${value}`);
                setSuggestions(response.data.tags);
            } else {
                setSuggestions([]);
            }
        }
    };

    const handleAddTag = () => {
        if (selectedTag) {
            onTagSelect({
                ...selectedTag,
                name: selectedTag.label, // Use the selected label as 'name'
                label: userLabel, // User-defined label
                wikidata_id: selectedTag.id
            });
            setUserLabel('');
            setSelectedTag(null);
            setSearchTerm('');
            setTagDescription('');
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Autocomplete
                options={suggestions}
                getOptionLabel={(option) => option.label}
                style={{ width: 300 }}
                renderInput={(params) => (
                    <TextField {...params}
                        label="Search tags"
                        variant="outlined"
                        style={{"background-color": "rgb(240, 240, 240)"}}/>
                )}
                onInputChange={handleSearchChange}
                onChange={(event, newValue) => {
                    setSelectedTag(newValue);
                    setTagDescription(newValue ? newValue.description : '');
                }}
                renderOption={(props, option) => (
                    <li {...props}>
                        <Box display="flex" flexDirection="column">
                            <Typography variant="body1">{option.label}</Typography>
                            <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                                {option.description}
                            </Typography>
                        </Box>
                    </li>
                )}
            />
            {tagDescription && (
                <Typography variant="body2" style={{ marginTop: '10px', marginLeft: '5px', fontSize: '0.8rem' }}>
                    {tagDescription}
                </Typography>
            )}
            <TextField
                label="Label"
                variant="outlined"
                value={userLabel}
                onChange={(e) => setUserLabel(e.target.value)}
                style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000', marginTop: '10px', "background-color": "rgb(240, 240, 240)"}}
            />
            <Button onClick={handleAddTag} variant="contained" className="btn btn-primary middle" style={{ marginTop: '10px', borderRadius: 10, backgroundColor: "#7E49FF" }}>Add Tag</Button>
            <br/>
        </Box>
    );
}

export default TagSearch;
