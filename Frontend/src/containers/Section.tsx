import React, { useState } from 'react';
import { Typography, Card, CardMedia, CardContent, IconButton, Button } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Item, SectionProps } from '../redux/types';
import { Link as RouterLink } from 'react-router-dom';


export default function Section({ title, items }: SectionProps) {
  const [startIndex, setStartIndex] = useState(0); // Index of the first visible item
  const itemsPerPage = 4; // Number of items to display per "page"

  // Max 4 items shown at a time
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

  // Navigation handlers
  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (startIndex + itemsPerPage < items.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  return (
    <div>
      {/* Section Header with Title & View More */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        {/* Section Title */}
        <Typography
          variant="h4"
          style={{
            fontWeight: 'bold',
          }}
        >
          {title}
        </Typography>

        {/* Section "View More" */}
        <Typography
          variant="h4"
          component={RouterLink}
          to={`/${title.toLowerCase().replace(/\s+/g, '')}`} // Dynamic link based on the title
          style={{
            textDecoration: 'none',
            color: 'black',
            fontWeight: 'bold',
            padding: '10px 20px',
            transition: 'all 0.3s ease-in-out', // Smooth transition effect
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#555';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'black'; // Reset text color
          }}
        >
          View More&nbsp;&gt;
        </Typography>
      </div>

      {/* Fallback Message if No Items */}
      {items.length === 0 ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '250px',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            style={{
              color: '#888',
              fontSize: '3rem',
            }}
          >
            There are currently no <strong>{title}</strong> streams available.
          </Typography>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          
          {/* Previous Button */}
          <IconButton
            onClick={handlePrev}
            disabled={startIndex === 0}
            style={{
              position: 'absolute',
              left: '50px',
              backgroundColor: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <ArrowBack />
          </IconButton>

          {/* Items */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${itemsPerPage}, 1fr)`,
              gap: '25px',
              flexGrow: 1,
            }}
          >
            {visibleItems.map((item) => (
              <Card
                key={item.id}
                component={RouterLink} // Use RouterLink for navigation
                to={item.link} // Navigate to the item's link (e.g., "/live/1" or "/ondemand/1")
                style={{
                  width: '300px',
                  height: '250px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  borderRadius: '10px',
                  textDecoration: 'none', // Remove default link styling
                }}
              >
                <CardMedia
                  component="img"
                  image={item.thumbnail}
                  alt={item.title}
                  style={{
                    height: '180px',
                    objectFit: 'cover',
                  }}
                />
                <CardContent>
                  <Typography variant="subtitle1" style={{ textAlign: 'center' }}>
                    {item.title}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Next Button */}
          <IconButton
            onClick={handleNext}
            disabled={startIndex + itemsPerPage >= items.length}
            style={{
              position: 'absolute',
              right: '50px',
              backgroundColor: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <ArrowForward />
          </IconButton>
        </div>
      )}
    </div>
  );
}
