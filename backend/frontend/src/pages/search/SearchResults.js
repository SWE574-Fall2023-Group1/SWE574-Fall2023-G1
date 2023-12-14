import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './SearchResults.module.css'; // Ensure you have the appropriate CSS
import withAuth from '../../authCheck';
import { Button } from '@mui/material';
import locationIcon from '../../assets/images/location.png';
import dateIcon from '../../assets/images/date.png';

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stories = location.state ? location.state.stories : [];
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(stories.length / pageSize);

  const handleStoryClick = (id) => {
    navigate(`/story/${id}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
        const date = new Date(story.date).toLocaleDateString("en-US", dateOptions);
        dateString = `${date}`;
        break;
      case "interval_date":
        const startDate = new Date(story.start_date).toLocaleDateString("en-US", dateOptions);
        const endDate = new Date(story.end_date).toLocaleDateString("en-US", dateOptions);
        dateString = `Start: ${startDate} \n End: ${endDate}`;
        break;
      default:
        dateString = "";
    }
    return dateString;
  };


  return (
    <div className={styles.searchResultsContainer}>
      {stories.length > 0 ? (
        stories.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(story => (
          <div key={story.id} className={styles.storyBox}>
            <div className={styles.authorAndDate}>
              <p className={styles.storyAuthor}> {story.author_username || 'Unknown'}</p>
              <p className={styles.postedOn}>Posted on {new Date(story.creation_date).toLocaleDateString()}</p>
            </div>
            <div className={styles.storyDetails}>
              <h3 className={styles.storyTitle} onClick={() => handleStoryClick(story.id)}>{story.title}</h3>
            </div>
            <div className={styles.dateAndLocation}>
            <div style={{display: 'flex', justifyContent: 'left', alignItems: 'left', marginBottom: 5}}><img src={dateIcon} style={{ marginRight: 6 }} alt="Date Icon"/>{`${formatDate(story)}`}</div>
              <div style={{display: 'flex', justifyContent: 'left', alignItems: 'left'}}>
                <img src={locationIcon} style={{ marginRight: 10 }} alt="Location Icon"/>
                {story.location_ids && story.location_ids.length > 0 && story.location_ids[0].name ? decodeURIComponent(story.location_ids[0].name) : 'No Location'}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No stories found.</p>
      )}
      <div className={styles.pagination}>
        <Button variant="contained" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            variant="contained"
            key={index}
            className={index + 1 === currentPage ? styles.activePageButton : styles.pageButton}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button variant="contained" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default withAuth(SearchResults);
