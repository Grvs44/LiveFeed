import React from 'react';
import { Typography, Card, CardMedia, CardContent } from '@mui/material';
import { Item, SectionProps } from '../redux/types'

export default function Section({ title, items }: SectionProps) {
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

      {/* Scrollable List */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start', // Cards will also align left
          gap: '30px',
          flexWrap: 'wrap',
        }}
      >
        {items.map((item) => (
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
    </div>
  );
}
