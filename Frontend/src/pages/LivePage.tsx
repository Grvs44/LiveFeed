import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Box,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useGetStreamsInfoMutation } from '../redux/apiSlice';
import { setTitle } from '../redux/titleSlice';
import { Link as RouterLink } from 'react-router-dom';
import { Item } from '../redux/types';
import '../assets/HomePage.css';

export default function LivePage() {
  const dispatch = useDispatch();
  const [fetchStreamsInfo, { data: streamsData, isLoading, isError }] =
    useGetStreamsInfoMutation();

  // Set the title and fetch live streams
  useEffect(() => {
    dispatch(setTitle('Live Streams'));
    fetchStreamsInfo();
  }, [dispatch, fetchStreamsInfo]);

  // Extract only live streams
  const liveStreams: Item[] =
    streamsData
      ?.filter((stream: any) => stream.live_status === 1)
      .map((stream: any) => ({
        id: stream.id,
        streamer: stream.streamer,
        title: stream.title,
        thumbnail: stream.image,
        tags: stream.tags,
        link: `/live/${stream.id}`,
      })) || [];

  // Handle loading and error states
  if (isLoading) {
    return <Typography>Loading live streams...</Typography>;
  }

  if (isError) {
    return (
      <Typography>
        Failed to load live streams. Please try again later.
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Page Title */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        Live Streams
      </Typography>

      {/* Grid Container */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {liveStreams.map((stream) => (
          <Card
            key={stream.id}
            component={RouterLink}
            to={stream.link}
            sx={{
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              borderRadius: '10px',
              textDecoration: 'none',
              position: 'relative',
            }}
          >
            {/* Badge for "Live" */}
            <Box className="badgeLive">
              LIVE
            </Box>

            {/* Thumbnail */}
            <CardMedia
              component="img"
              image={stream.thumbnail}
              alt={stream.title}
              sx={{
                height: 200,
                objectFit: 'cover',
              }}
            />

            <CardContent sx={{ padding: '10px' }}>
              {/* Stream Title */}
              <Typography
                variant="subtitle1"
                sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '5px' }}
              >
                {stream.title}
              </Typography>
              {/* Streamer */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                }}
              >
                <RestaurantMenuIcon sx={{ marginRight: '5px' }} />
                <Typography variant="subtitle1">{stream.streamer}</Typography>
              </Box>
              {/* Stream Tags */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                {stream.tags &&
                  stream.tags.map((tag, index) => (
                    <Chip key={index} label={tag}/>
                  ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
