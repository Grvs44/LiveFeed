import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux'
import { useStartStreamMutation } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'
import {Card,CardContent,Typography,Grid,List,ListItem,ListItemText,Paper,Box,Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Stack, Chip, MenuItem,Select} from '@mui/material';
import { AccessTime, FormatListNumbered, ShoppingCart , Edit, Delete,Add, PlayArrow, RestaurantMenu,Timer,Person, Group, LocalOffer} from '@mui/icons-material';
import {Recipe} from '../redux/types'
import { useCreateRecipeMutation,useGetRecipeMutation,useUpdateRecipeMutation,useDeleteRecipeMutation } from '../redux/apiSlice';
import "../App.css";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { BlobServiceClient } from "@azure/storage-blob";
import { LoginContext } from '../context/LoginProvider';
import { RecipeListContainer } from '../containers/RecipeListBox';
import TAGS from '../config/Tags'



export default function RecipesPage() {
  const dispatch = useDispatch()
  const [startStream] = useStartStreamMutation()
  const { activeAccount } = useContext(LoginContext);
  const handleStart = async () => {
    const stream = await startStream('hello').unwrap()
    console.log('started stream:')
    console.log(stream)
  }

  React.useEffect(() => {
    dispatch(setTitle('Recipes'))
  }, [])
  
  const [currentTab, setCurrentTab] = useState<'uploads' | 'manager'>('manager');
  if (!activeAccount) {
    return <Typography variant="h6" style={{margin: '20px'}}>Please sign in to access this page.</Typography>;
  }
  return (
    <div>
      <Box display="flex" mb={2} mt={0} justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Typography variant="h6" style={{marginRight: 10, marginLeft: 10}}>Recipe Management</Typography>
          {currentTab === 'manager' && (
            <IconButton title="Upload Recipe" onClick={() => setCurrentTab('uploads')}>
              <AddBoxIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      {currentTab === 'uploads' && <RecipeUploads closeTab={() => setCurrentTab('manager')} />}
      {currentTab === 'manager' && <RecipeManagement />}
    </div>
  );
  
}

function RecipeUploads({ closeTab }: { closeTab: () => void }) {
  const [createRecipe] = useCreateRecipeMutation();
  const [recipes, setRecipes] = useState<{
    title: string;
    imageUrl: string;
    steps: { id: number; text: string }[];
    shopping: { item: string; quantity: number; unit: string }[];
    scheduledDate: string;
    cookTime: number;
    tags: string[];
    servings: number;
  }[]>([]);
  
  const [title, setTitle] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [steps, setSteps] = useState<{ id: number; text: string }[]>([]);
  const [shopping, setShopping] = useState<{ item: string; quantity: number; unit: string }[]>([]);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [cookTime, setCookTime] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [servings, setServings] = useState<number>(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const addStep = () => {
    setSteps([...steps, { id: steps.length + 1, text: '' }]);
  };

  const addText = (stepCount: number, stepSentence: string) => {
    const updatedSteps = [...steps]; 
    for (let i = 0; i < updatedSteps.length; i++) {
      if (updatedSteps[i].id === stepCount) {
        updatedSteps[i] = { ...updatedSteps[i], text: stepSentence };
        break;
      }
    }
    setSteps(updatedSteps);
  };

  const deleteLatestStep = () => {
    if (steps.length > 0) {
      setSteps(steps.slice(0, -1));
    }
  };

  const addShoppingItem = () => {
    setShopping([...shopping, { item: '', quantity: 0, unit: '' }]);
  }
  
  const updateShoppingItem = (index: number, item: 'item' | 'quantity' | 'unit', value: string | number) => {
    const updatedItemList = [...shopping];
    for (let i = 0; i < updatedItemList.length; i++) {
      if (i === index) {
        updatedItemList[i] = { ...updatedItemList[i], [item]: value };
        break;
      }
    }
    setShopping(updatedItemList);
  };

  const deleteLatestShopping = () => {
    if (shopping.length > 0) {
      setShopping(shopping.slice(0, -1));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = null;
    if (e.target.files && e.target.files.length > 0) {
      file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    setImageFile(file);
  };

  const uploadRecipe = async () => {
    if (title && steps.length > 0 && shopping.length > 0 && scheduledDate && cookTime > 0 && servings > 0) {
      let uploadedImageUrl = '';

      if (imageFile) {
        const sasUrl = "https://livefeedstorage.blob.core.windows.net/recipe-thumbnails?sp=racwdli&st=2024-12-29T05:41:51Z&se=2025-04-01T13:41:51Z&spr=https&sv=2022-11-02&sr=c&sig=nv09TRDE3MO16fuwmkJlpwKTL0cEoNPlOBe6bhCKkus%3D";
        const containerName = "recipe-thumbnails";
        const blobServiceClient = new BlobServiceClient(sasUrl);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const randomString = Math.random().toString(36).substring(2, 15);
        const blobName = `images/${randomString}-${imageFile.name}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadBrowserData(imageFile);
        uploadedImageUrl = blockBlobClient.url;
      }
      const finalImageUrl = uploadedImageUrl || imageUrl;

      const newRecipe = { 
        title, 
        imageUrl: finalImageUrl, 
        steps, 
        shopping, 
        scheduledDate,
        cookTime,
        tags,
        servings
      };
      try {
        const response = await createRecipe(newRecipe).unwrap();
        alert("Recipe uploaded successfully");
        setRecipes([...recipes, newRecipe]);
        setTitle('');
        setImageUrl('');
        setSteps([]);
        setShopping([]);
        setScheduledDate('');
        setCookTime(0);
        setTags([]);
        setServings(1);
        closeTab();
      } catch (error) {
        console.error("Error uploading recipe to DB:", error);
        alert("Error uploading recipe to DB");
      }
    }
    else {
      console.error("Please fill in all the required information before uploading")
      alert("Please fill in all the required information before uploading");
    }
  };

  return (
    <div className='container'>
      <h2 className='header'>Upload Recipe</h2>
      <div className='section'>
        <label className='label'>Title:</label>
        <input className='input' type="text" placeholder="Recipe Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <h3>Select Image for Recipe</h3>
        <input className="uploadImgbutton" type="file" accept="image/*" onChange={uploadImage} />
        {imagePreview && (
          <div className="imagePreviewContainer">
            <img className="imagePreview" src={imagePreview} alt="Image Preview"/>
          </div>
        )}
      </div>

      <div className='section'>
        <label className='label'>Cook Time (minutes):</label>
        <input
          className='input'
          type="number"
          min="0"
          value={cookTime}
          onChange={(e) => setCookTime(Math.max(0, parseInt(e.target.value)))}
        />
      </div>

      <div className='section'>
        <label className='label'>Servings:</label>
        <input
          className='input'
          type="number"
          min="1"
          value={servings}
          onChange={(e) => setServings(Math.max(1, parseInt(e.target.value)))}
        />
      </div>

      <div className='section'>
        <label className='label'>Tags:</label>
        <div className='tagInput'>
          <select
            className='input'
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          >
          <option value="">Select tag</option>
          {TAGS.map((tag) => (
          <option key={tag.name}>
            {tag.name}
          </option>
        ))}
          </select>
          <button className='addTagButton' onClick={handleAddTag}>Add Tag</button>
        </div>
        <div className='tagContainer'>
          {tags.map((tag, index) => (
            <span key={index} className='tag'>
              {tag}
              <button className='removeTag' onClick={() => removeTag(tag)}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className='section'>
        <label className='label'>Steps:</label>
        {steps.map((step) => (
          <div key={step.id}>
            <input className='input' type="text" placeholder={`Step ${step.id}`} value={step.text} onChange={(e) => addText(step.id, e.target.value)} />
          </div>
        ))}
        <button className='addButton' onClick={addStep}>Add Step</button>
        {steps.length > 0 && ( <button className='deleteButton' onClick={deleteLatestStep}>Remove Latest Step</button>)}
      </div>

      <div className='section'>
        <label className='label'>Shopping List:</label>
        {shopping.map((item, index) => (
          <div key={index} className='shoppingRow'>
            <input className='input' type="text" placeholder="Item" value={item.item} onChange={(e) => updateShoppingItem(index, 'item', e.target.value)} />
            <input className='input' type="number" placeholder="quantity" value={item.quantity} onChange={(e) => updateShoppingItem(index, 'quantity', parseFloat(e.target.value))} />
            <input className='input' type="text" placeholder="Unit (e.g., kg, g, ml)" value={item.unit} onChange={(e) => updateShoppingItem(index, 'unit', e.target.value)} />
          </div>
        ))}
        <button className='addButton' onClick={addShoppingItem}>Add Shopping Item</button>
        {shopping.length > 0 && (<button className='deleteButton' onClick={deleteLatestShopping}>Remove Latest Item</button>)}
      </div>

      <div className='section'>
        <label className='label'>Schedule Stream Date:</label>
        <input className='input' type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)}  min={new Date().toISOString().slice(0, 16)}/>
      </div>

      <button className='addButton' onClick={uploadRecipe}>Upload Recipe</button>
      <button className='backButton' onClick={closeTab}> Back to Manager </button>

      <div>
        <ul>
          {recipes.map((recipe, i) => (
            <li key={i}>
              <strong>{recipe.title}</strong>
              {recipe.imageUrl && (
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.title} 
                  style={{ maxWidth: '200px', display: 'block', margin: '10px 0' }} 
                />
              )}
              <p>Cook Time: {recipe.cookTime} minutes</p>
              <p>Servings: {recipe.servings}</p>
              {recipe.tags.length > 0 && (
                <p>Tags: {recipe.tags.join(', ')}</p>
              )}
              <p>Steps:</p>
              <ol>
                {recipe.steps.map((step) => (
                  <li key={step.id}>{step.text}</li>
                ))}
              </ol>
              <p>Shopping List:</p>
              <ul>
                {recipe.shopping.map((item, i) => (
                  <li key={i}>
                    {item.quantity} {item.unit} of {item.item}
                  </li>
                ))}
              </ul>
              <p>Scheduled Date: {new Date(recipe.scheduledDate).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
function RecipeManagement () {
 
  const [deleteRecipe] = useDeleteRecipeMutation();
  const [getRecipe] = useGetRecipeMutation();
  const [updateRecipe] = useUpdateRecipeMutation();
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [editDialog, setEditDialog] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  

  React.useEffect(() => {
    fetchRecipes();
  }, []);
  const params = new URLSearchParams({

  });
  const currDate = (dateStr: string | number | Date) => {
    if (!dateStr) return false;
    const recipeDate = new Date(dateStr);
    const today = new Date();
    return (
      recipeDate.getDate() === today.getDate() &&
      recipeDate.getMonth() === today.getMonth() &&
      recipeDate.getFullYear() === today.getFullYear()
    );
  };

  const handleStartRecipe = (recipe: Recipe) => {
    console.log('Starting recipe:', recipe.title);
  };

  const fetchRecipes = async () => {
    try {
      const response = await getRecipe("").unwrap();
      console.log(response)
      setRecipeList(response);
    } catch (error) {
      console.error("Error getting recipe list:", error);
    }
  };

  const handleDeleteRecipe = async (recipe : Recipe) => {
  try {
    await deleteRecipe(recipe).unwrap();
    fetchRecipes();
  } catch (error) {
    console.error("Error deleting recipe:", error);
  }
};

  const handleEditClick = (recipe : Recipe) => {
    setEditingRecipe({ ...recipe });
    setEditDialog(true);
  };

  const handleEditClose = () => {
    setEditDialog(false);
    setEditingRecipe(null);
  };

  const handleSaveChanges = async () => {
    try {
      await updateRecipe(editingRecipe).unwrap();
      handleEditClose();
      fetchRecipes();
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const updateStep = (id : number, newDesc : string) => {
    setEditingRecipe(prev => prev ? ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === id ? { ...step, text: newDesc } : step
      )
    }) : prev);
  };

  const updateShoppingItem = (index: number, field: string, value: string | number) => {
    setEditingRecipe(prev => prev ? ({
      ...prev,
      shopping: prev.shopping.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }) : null);
  };

const addStep = () => {
  setEditingRecipe(prev => prev ? ({
    ...prev,
    steps: [...prev.steps, { 
      id: prev.steps.length + 1, 
      text: '' 
    }]
  }) : prev);
};

const deleteStep = (id: number) => {
  setEditingRecipe(prev => prev ? ({
    ...prev,
    steps: prev.steps
      .filter(step => step.id !== id)
      .map((step, idx) => ({ ...step, id: idx + 1 }))
  }) : prev);
};

const addShoppingItem = () => {
  setEditingRecipe(prev => prev ? ({
    ...prev,
    shopping: [...prev.shopping, { item: '', quantity: 0, unit: '' }]
  }) : prev);
};

const deleteShoppingItem = (index: number) => {
  setEditingRecipe(prev => prev ? ({
    ...prev,
    shopping: prev.shopping.filter((_, i) => i !== index)
  }) : prev);
};


  const formatDate = (dateStr: string | number | Date) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString();
  };
  if (!recipeList) {
    return (
      <Box sx={{ maxWidth: 1200, margin: 'auto', p: 2 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography>Loading recipe details...</Typography>
        </Paper>
      </Box>
    );
  }
 
  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 2 }}>
    {recipeList.map((recipe) => (
      <Card variant="elevation" sx={{ mb: 3 }} key={recipe.id}>
        <CardContent>
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

            <Grid item xs={12}>
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

          {/* Action Buttons */}
          <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 2 
        }}>
          <Box>
            {currDate(recipe.date) && (
              <Button
                startIcon={<PlayArrow />}
                variant="contained"
                sx={{ 
                  backgroundColor: '#32CD32',
                  '&:hover': {
                    backgroundColor: '#2E6F40'
                  }
                }}
                onClick={() => handleStartRecipe(recipe)}
              >
                Start Streaming
              </Button>
            )}
          </Box>
          
          <Box>
            <Button
              startIcon={<Edit />}
              variant="contained"
              color="primary"
              onClick={() => handleEditClick(recipe)}
              sx={{ mr: 1 }}
            >
              Edit Recipe
            </Button>
            <Button
              startIcon={<Delete />}
              variant="outlined"
              color="error"
              onClick={() => handleDeleteRecipe(recipe)}
            >
              Delete
            </Button>
          </Box>
        </Box>
        </CardContent>
      </Card>
    ))}
    
      <Dialog open={editDialog} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Recipe</DialogTitle>
        <DialogContent>
         {editingRecipe && (
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Recipe Title"
              value={editingRecipe.title}
              onChange={(e) => setEditingRecipe(prev => prev ? { ...prev, title: e.target.value } : null)}
              margin="normal"
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Cook Time (minutes)"
                  type="number"
                  value={editingRecipe.cookTime}
                  onChange={(e) => setEditingRecipe(prev => prev ? { ...prev, cookTime: parseInt(e.target.value) } : null)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Servings"
                  type="number"
                  value={editingRecipe.servings}
                  onChange={(e) => setEditingRecipe(prev => prev ? { ...prev, servings: parseInt(e.target.value) } : null)}
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Tags</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {editingRecipe.tags?.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => {
                      setEditingRecipe(prev => prev ? {
                        ...prev,
                        tags: prev.tags.filter((_, i) => i !== index)
                      } : null)
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Select
                  fullWidth
                  value=""
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value && (!editingRecipe.tags?.includes(value))) {
                      setEditingRecipe(prev => prev ? {
                        ...prev,
                        tags: [...(prev.tags || []), value]
                      } : null);
                    }
                  }}
     
              >
                {TAGS.map((tag: { id: string; name: string }) => (
                  <MenuItem  key={tag.id} value={tag.name}>{tag.name}</MenuItem>
      
                ))}
                </Select>
              </Box>
            </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="h6">Steps</Typography>
              <Button startIcon={<Add />} onClick={addStep}>Add Step</Button>
            </Box>
            {editingRecipe.steps.map((step) => (
              <Box key={step.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label={`Step ${step.id}`}
                  value={step.text}
                  onChange={(e) => updateStep(step.id, e.target.value)}
                  margin="normal"
                />
                <IconButton onClick={() => deleteStep(step.id)}>
                  <Delete />
                </IconButton>
              </Box>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="h6">Shopping List</Typography>
              <Button startIcon={<Add />} onClick={addShoppingItem}>Add Item</Button>
            </Box>
            {editingRecipe.shopping.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                <TextField
                  label="Item"
                  value={item.item}
                  onChange={(e) => updateShoppingItem(index, 'item', e.target.value)}
                />
                <TextField
                  label="quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateShoppingItem(index, 'quantity', parseFloat(e.target.value))}
                />
                <TextField
                  label="Unit"
                  value={item.unit}
                  onChange={(e) => updateShoppingItem(index, 'unit', e.target.value)}
                />
                <IconButton onClick={() => deleteShoppingItem(index)}>
                  <Delete />
                </IconButton>
              </Box>
            ))}
              <TextField
                fullWidth
                label="Scheduled Date"
                type="datetime-local"
                value={editingRecipe.date?.slice(0, 16) || ''}
                onChange={(e) => setEditingRecipe(prev => prev ? { ...prev, date: e.target.value } : null)}
                margin="normal"
                inputProps={{
                  min: new Date().toISOString().slice(0, 16)
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleSaveChanges} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    
  );
 };