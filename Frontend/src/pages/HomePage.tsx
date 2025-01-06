import React, { useEffect, useState, useRef} from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTitle } from '../redux/titleSlice';
import Section from '../containers/Section';
import { Item } from '../redux/types';
import '../assets/HomePage.css';
import {
  useGetLiveRecipeMutation,
  useGetOnDemandRecipeMutation,
  useGetUpcomingRecipeMutation,
} from '../redux/apiSlice';
import TAGS from '../config/Tags';
import { Box, Chip, IconButton } from '@mui/material';
import { State } from '../redux/types';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function HomePage() {
  const dispatch = useDispatch();
  const location = useLocation(); // Track current route
  const tags = useSelector((state: State) => state.tags.tags || []);
  const [selectedTag, setSelectedTag] = useState<string | null>(null); // Selected tag state
  const { searchQuery, setSearchQuery } = useOutletContext<{
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  }>();

  const [fetchLiveStreams, { data: liveData }] = useGetLiveRecipeMutation();
  const [fetchOnDemandStreams, { data: onDemandData }] = useGetOnDemandRecipeMutation();
  const [fetchUpcomingStreams, { data: upcomingData }] = useGetUpcomingRecipeMutation();


  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(setTitle('LiveFeed'));
    fetchLiveStreams();
    fetchOnDemandStreams();
    fetchUpcomingStreams();
  }, [dispatch, fetchLiveStreams, fetchOnDemandStreams, fetchUpcomingStreams]);


  // Clear searchQuery ONLY when navigating to the homepage from another tab
  useEffect(() => {
    if (location.pathname === '/' && searchQuery === null) {
      setSearchQuery(''); // Reset only if no active query exists
    }
  }, [location.pathname, searchQuery, setSearchQuery]);

  const scrollTags = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150; // Adjust scroll step
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const filterByTags = (items: Item[]) => {
    if (!selectedTag) return items; // Show all items if no tag is selected
  
    if (selectedTag === 'Favourites') {
      const filtered = items.filter((item) => {
        return item.tags?.some((tag: string) =>
          tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
        );
      });
      return filtered;
    }
  
    // Filtering for other tags
    return items.filter((item) =>
      item.tags?.some((tag: string) => tag.toLowerCase() === selectedTag.toLowerCase())
    );
  };

  useEffect(() => {
    console.log('Tags from Redux:', tags); // Print the user's preferred tags
  }, [tags]);

  const liveStreams: Item[] =
    liveData?.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      thumbnail: recipe.image,
      tags: recipe.tags,
      link: `/live/${recipe.id}`,
    })) || [];

  const onDemandStreams: Item[] = 
    onDemandData?.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      thumbnail: recipe.image,
      tags: recipe.tags,
      link: `/ondemand/${recipe.id}`,
    })) || [];

  const upcomingStreams: Item[] =
    upcomingData?.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      thumbnail: recipe.image,
      tags: recipe.tags,
      link: `/upcoming/${recipe.id}`,
    })) || [];

  // Apply filtering logic based on search query
  const filteredLiveStreams = filterByTags(
    searchQuery
      ? liveStreams.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : liveStreams
  );

  const filteredOnDemandStreams = filterByTags(
    searchQuery
      ? onDemandStreams.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : onDemandStreams
  );

  const filteredUpcomingStreams = filterByTags(
    searchQuery
      ? upcomingStreams.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : upcomingStreams
  );

  return (
    
    <div className="homePageContainer">
      {/* Tag Bar with Arrows */}
    <Box
      className="sectionWrapper" // Use the same styles as other sections
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        position: 'relative',
      }}
    >
      {/* Left Arrow */}
      <IconButton
        onClick={() => scrollTags('left')}
        sx={{
          position: 'absolute',
          left: '-40px', // Adjust the arrow positions
          zIndex: 10,
        }}
      >
        <ArrowBackIosIcon />
      </IconButton>

      {/* Tag Bar */}
      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none', // Hide scrollbar in Firefox
          msOverflowStyle: 'none', // Hide scrollbar in IE/Edge
          padding: '10px 0',
          '&::-webkit-scrollbar': {
            display: 'none', // Hide scrollbar in Chrome/Safari
          },
        }}
      >
        {/* "All" Button */}
        <Chip
          label="All"
          onClick={() => setSelectedTag(null)}
          color={!selectedTag ? 'primary' : 'default'}
          style={{ margin: '5px' }}
        />
        
        {/* Favourites Chip */}
        {tags.length > 0 && (
          <Chip
            label="Favourites"
            onClick={() => setSelectedTag('Favourites')}
            color={selectedTag === 'Favourites' ? 'primary' : 'default'}
            style={{ margin: '5px' }}
          />
        )}

        {/* Dynamic Tags */}
        {TAGS.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name} // Display tag name
            onClick={() => setSelectedTag(tag.name)} // Set selected tag
            color={selectedTag === tag.name ? 'primary' : 'default'}
            style={{ margin: '5px' }}
          />
        ))}
      </Box>

      {/* Right Arrow */}
      <IconButton
        onClick={() => scrollTags('right')}
        sx={{
          position: 'absolute',
          right: '-40px', // Adjust the arrow positions
          zIndex: 10,
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
      {/* Live Section */}
      <div className="sectionWrapper" style={{ marginBottom: '50px' }}>
        <Section title="Live" items={filteredLiveStreams} />
      </div>

      {/* On-Demand Section */}
      <div className="sectionWrapper" style={{ marginBottom: '50px' }}>
        <Section title="Recent Broadcasts" items={filteredOnDemandStreams} />
      </div>

      {/* Upcoming Section */}
      <div className="sectionWrapper">
        <Section title="Upcoming" items={filteredUpcomingStreams} />
      </div>
    </div>
  );
}
