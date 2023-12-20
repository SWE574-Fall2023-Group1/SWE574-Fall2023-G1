import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Recommendations.module.css"; // Make sure to create this CSS file
import locationIcon from "../../assets/images/location.png";
import dateIcon from "../../assets/images/date.png";

function Recommendations({ currentTheme }) {
  const [recommendedStories, setRecommendedStories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/recommendations`,
          { withCredentials: true }
        );
        setRecommendedStories(response.data.recommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  const handleStoryClick = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formatDate = (story) => {
    let dateString = "";
    const optionsWithoutTime = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const dateOptions = story.include_time ? options : optionsWithoutTime;

    switch (story.date_type) {
      case "decade":
        dateString = `Decade: ${story.decade}s`;
        break;
      case "year":
        dateString = `Year: ${story.year}`;
        break;
      case "year_interval":
        const startYear = story.start_year;
        const endYear = story.end_year;
        dateString = `Start: ${startYear} \n End: ${endYear}`;
        break;
      case "normal_date":
        const date = new Date(story.date).toLocaleDateString(
          "en-US",
          dateOptions
        );
        dateString = `${date}`;
        break;
      case "interval_date":
        const startDate = new Date(story.start_date).toLocaleDateString(
          "en-US",
          dateOptions
        );
        const endDate = new Date(story.end_date).toLocaleDateString(
          "en-US",
          dateOptions
        );
        dateString = `Start: ${startDate} \n End: ${endDate}`;
        break;
      default:
        dateString = "";
    }
    return dateString;
  };

  return (
    <div>
      <h1 style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000', fontFamily: "'Josefin Sans', sans-serif" }}>
        Recommended for You
      </h1>
      {recommendedStories.map((recommendation) => {
        const story = recommendation.story; // Access the nested story object
        return (
          <div key={story.id} className={styles.storyBox}>
            <div className={styles.authorAndDate}>
              <p className={styles.storyAuthor}>
                {story.author_username || "Unknown"}
              </p>
              <p className={styles.postedOn}>
                Posted on {new Date(story.creation_date).toLocaleDateString()}
              </p>
            </div>
            <div className={styles.storyDetails}>
              <h3
                className={styles.storyTitle}
                onClick={() => handleStoryClick(story.id)}
              >
                {story.title}
              </h3>
            </div>
            <div className={styles.dateAndLocation}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                  marginBottom: 5,
                }}
              >
                <img src={dateIcon} style={{ marginRight: 6 }} alt="Date Icon" />
                {`${formatDate(story)}`}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                }}
              >
                <img
                  src={locationIcon}
                  style={{ marginRight: 10 }}
                  alt="Location Icon"
                />
                {story.location_ids &&
                story.location_ids.length > 0 &&
                story.location_ids[0].name
                  ? decodeURIComponent(story.location_ids[0].name)
                  : "No Location"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Recommendations;
