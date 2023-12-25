import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import styles from './SearchUserResults.module.css';


function SearchUserResults({ currentTheme }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useParams();

  const navigate = useNavigate();

  const handleUserClick = async (id) => {
    navigate(`/user-profile/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery) {
        return;
      }

      try {
        setLoading(true);
        const searchResponse = await axios.get(
          `http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/searchUser?search=${searchQuery}`,
          { withCredentials: true }
        );
        console.log('searchResponse:', searchResponse);
        setResults(searchResponse.data.users);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div>
      <h2 style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000' }}>Search Results</h2>
      {loading ? (
        <p style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000' }}>Loading...</p>
      ) : (
        results.map(user => (
          <div key={user.id} onClick={() => handleUserClick(user.id)}>
            <h3 className={styles.searchedUser}>{user.username}</h3>
          </div>
        ))
      )}
    </div>
  );
}

export default SearchUserResults;
