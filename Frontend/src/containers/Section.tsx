import React, { useState } from 'react';
import { Typography, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Item, SectionProps } from '../redux/types';

export default function Section({ title, items }: SectionProps) {
  const [startIndex, setStartIndex] = useState(0); // Index of the first visible item
  const itemsPerPage = 4; // Number of items to display per "page"

  // Max 4 items shown at a time
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

  // Navigation handlers
  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleNext = () => {
    if (startIndex + itemsPerPage < items.length) {
      setStartIndex(startIndex + 1);
    }
  };

  return (
    <div>
      {/* Section Title */}
      <Typography
        variant="h4"
        style={{
          marginBottom: '20px',
          textAlign: 'left',
          fontWeight: 'bold',
        }}
      >
        {title}
      </Typography>

      {/* Navigation and Items */}
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
          }}>
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
              style={{
                width: '300px',
                height: '250px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                borderRadius: '10px',
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
    </div>
  );
}
