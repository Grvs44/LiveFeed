import React from 'react';
import { 
  Card, CardContent, Typography, Grid, List, ListItem, 
  ListItemText, Box, Divider, Stack, Chip 
} from '@mui/material';
import { 
  AccessTime, FormatListNumbered, ShoppingCart, 
  RestaurantMenu, Timer, Group, LocalOffer 
} from '@mui/icons-material';
import { Recipe } from '../redux/types';

interface RecipeListProps {
  recipes: Recipe[];
}

export const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 2 }}>
      {recipes.map((recipe) => (
        <Card sx={{ mb: 3 }} key={recipe.id}>
          <CardContent>
            <Grid container>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h4" gutterBottom>{recipe.title}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '300px',
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1,
                        overflow: 'hidden'
                      }}
                    >
                      {recipe.image ? (
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <RestaurantMenu sx={{ fontSize: 60, color: '#bdbdbd' }} />
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Date:</strong> {formatDate(recipe.date)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Timer sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Cook Time:</strong> {recipe.cookTime || '30'} minutes
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Group sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Servings:</strong> {recipe.servings || '4'} people
                      </Typography>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocalOffer sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography sx={{ mr: 2 }}><strong>Tags:</strong></Typography>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                          {recipe.tags && recipe.tags.length > 0 ? (
                            recipe.tags.map((tag, index) => (
                              <Chip key={index} label={tag} variant="outlined" size="small" />
                            ))
                          ) : (
                            <Typography>None</Typography>
                          )}
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FormatListNumbered sx={{ mr: 1 }} />
                        <Typography variant="h6">Steps</Typography>
                      </Box>
                      <List>
                        {recipe.steps?.map((step) => (
                          <ListItem key={step.id}>
                            <ListItemText
                              primary={
                                <Typography>
                                  <strong>{step.id}.</strong> {step.text}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ShoppingCart sx={{ mr: 1 }} />
                        <Typography variant="h6">Shopping List</Typography>
                      </Box>
                      <List>
                        {recipe.shopping?.map((item, index) => (
                          <React.Fragment key={index}>
                            <ListItem>
                              <ListItemText
                                primary={item.item}
                                secondary={`${item.quantity} ${item.unit}`}
                              />
                            </ListItem>
                            {index < recipe.shopping.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}