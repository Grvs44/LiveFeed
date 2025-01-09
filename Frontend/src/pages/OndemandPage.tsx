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
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Item } from '../redux/types';

export default function OndemandPage() {
  const dispatch = useDispatch();
  const [fetchStreamsInfo, { data: streamsData, isLoading, isError }] =
    useGetStreamsInfoMutation();
  // Set the title and fetch on-demand streams
  useEffect(() => {
    dispatch(setTitle('On-Demand Streams'));
    fetchStreamsInfo();
  }, [dispatch, fetchStreamsInfo]);

  // Extract only on-demand streams
  const onDemandStreams: Item[] =
    streamsData
      ?.filter((stream: any) => stream.live_status === 2) // 2 indicates on-demand
      .map((stream: any) => ({
        id: stream.id,
        streamer: stream.streamer,
        title: stream.title,
        thumbnail: stream.image,
        tags: stream.tags,
        link: `/ondemand/${stream.id}`,
      })) || [];

  // Handle loading and error states
  if (isLoading) {
    return <Typography>Loading on demand streams...</Typography>;
  }

  if (isError) {
    return (
      <Typography>
        Failed to load on-demand streams. Please try again later.
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
        On Demand Streams
      </Typography>

      {/* Grid Container */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {onDemandStreams.map((stream) => (
          <Card
            key={stream.id}
            component={RouterLink}
            to={stream.link}
            sx={{
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              borderRadius: '10px',
              textDecoration: 'none',
            }}
          >
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
