import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Chip
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Item, SectionProps } from '../redux/types';
import '../assets/HomePage.css';
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
    <div className="sectionContainer">
      {/* Section Header with Title */}
      <div className="sectionHeader">
        {/* Section Title */}
        <Typography
          variant="h3"
          component={RouterLink}
          to={`/${title.toLowerCase().replace(/\s+/g, '')}`}
          style={{ fontWeight: 'bold' }}
          className="sectionTitle"
        >
          {title}
        </Typography>
      </div>

      {/* Fallback Message if No Items */}
      {items.length === 0 ? (
        <div className="noItemsContainer">
          <Typography
            variant="h6"
            style={{ color: '#888', fontSize: '3rem' }}
          >
            There are currently no <strong>{title}</strong> streams available.
          </Typography>
        </div>
      ) : (
        <div className="itemsContainer">
          {/* Previous Button */}
          <IconButton
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="navButton navButtonLeft"
            style={{ position: 'absolute' }}
          >
            <ArrowBack />
          </IconButton>

          {/* Items */}
          <div className="itemsGrid">
            {visibleItems.map((item) => (
              <Card
                key={item.id}
                component={RouterLink}
                to={item.link}
                className="cardItem"
                style={{
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  borderRadius: '10px'
                }}
              >
                {/* Badge for "Live" */}
                {title.toLowerCase() === 'live' && (
                  <div className="badgeLive">LIVE</div>
                )}

                {/* Container that fills the CardMedia area */}
                <div className="cardMediaContainer">
                  {/* Absolute container covering the same area */}
                  <div className="diagonalContainer">
                    {/* Diagonal Label */}
                    {title.toLowerCase() === 'upcoming' && (
                      <div className="diagonalLabel">UPCOMING</div>
                    )}
                  </div>

                  {/* The actual image */}
                  <CardMedia
                    component="img"
                    image={item.thumbnail}
                    alt={item.title}
                    className="cardMedia"
                  />
                </div>

                <CardContent style={{ padding: '5px' }}>
                  {/* Display Title */}
                  <Typography
                    variant="subtitle1"
                    style={{ textAlign: 'center', marginBottom: '5px' }}
                  >
                    {item.title}
                  </Typography>

                  {/* Display Tags */}
                  <div className="tagsContainer">
                    {item.tags &&
                      item.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          className="tagChip"
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Next Button */}
          <IconButton
            onClick={handleNext}
            disabled={startIndex + itemsPerPage >= items.length}
            className="navButton navButtonRight"
            style={{ position: 'absolute' }}
          >
            <ArrowForward />
          </IconButton>
        </div>
      )}
    </div>
  );
}
