import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Recommendations() {
    const [recommendedStories, setRecommendedStories] = useState([]);
        console.log('Rendering Recommendations');

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/recommendations`, { withCredentials: true });
                console.log(response)
                setRecommendedStories(response.data.recommendations);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecommendations();
    }, []);

    return (
        <div>
            <h2>Recommended for You</h2>
            {recommendedStories.map(story => (
                <div key={story.id}>
                    <h3>{story.title}</h3>
                    {/* More story details */}
                </div>
            ))}
        </div>
    );
}

export default Recommendations;
