import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import { useStartStreamMutation } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'
import {Card,CardContent,Typography,Grid,List,ListItem,ListItemText,Paper,Box,Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton} from '@mui/material';
import { AccessTime, FormatListNumbered, ShoppingCart , Edit, Delete,Add} from '@mui/icons-material';
import {Recipe} from '../redux/types'
import { useCreateRecipeMutation,useGetRecipeMutation,useUpdateRecipeMutation,useDeleteRecipeMutation } from '../redux/apiSlice';



export default function RecipesPage() {
  const dispatch = useDispatch()
  const [startStream] = useStartStreamMutation()
  const handleStart = async () => {
    const stream = await startStream('hello').unwrap()
    console.log('started stream:')
    console.log(stream)
  }

  React.useEffect(() => {
    dispatch(setTitle('Recipes'))
  }, [])

  
  
  const [currerntTab, setCurrentTab] = useState<'uploads' | 'manager'>('uploads');

  return (
    <div>
        <p>Recipe Management</p>
        <div style={{ display: 'flex', gap: '10px'}}>
          <button onClick={() => setCurrentTab('uploads')}> Recipe Uploads </button>
          <button onClick={() => setCurrentTab('manager')}> Recipe Manager </button>
        </div>

        {currerntTab === 'uploads' && <RecipeUploads />}
        {currerntTab === 'manager' && <RecipeManagement />}
    </div>
  )
}

function RecipeUploads() {
  const [createRecipe] = useCreateRecipeMutation();
  const [recipes, setRecipes] = useState<{title: string; steps: { id: number; text: string }[]; shopping: { item: string; quantity: number; unit: string }[]; scheduledDate: string }[]>([]);
  const [title, setTitle] = useState<string>('');
  const [steps, setSteps] = useState<{ id: number; text: string }[]>([]);
  const [shopping, setShopping] = useState<{ item: string; quantity: number; unit: string }[]>([]);
  const [scheduledDate, setScheduledDate] = useState<string>('');

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

  const uploadRecipe = async () => {
    if (title && steps.length > 0 && shopping.length > 0 && scheduledDate) {
      const newRecipe = { title, steps, shopping, scheduledDate };
      try {
        const response = await createRecipe(newRecipe).unwrap();
        alert("Recipe uploaded successfully");
        setRecipes([...recipes, newRecipe]);
        setTitle('');
        setSteps([]);
        setShopping([]);
        setScheduledDate('');
      } catch (error) {
        console.error("Error uploading recipe to DB:", error);
        alert("Error uploading recipe to DB");
      }
    }
    else{
      console.error("Please fill in all the information before uploading")
    }
  };
  

  return (
    <div>
      <p>Recipe Uploads</p>

      <div>
        <label>Title:</label>
        <input type="text" placeholder="Recipe Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Steps:</label>
        {steps.map((step) => (
          <div key={step.id}>
            <input type="text" placeholder={`Step ${step.id}`} value={step.text} onChange={(e) => addText(step.id, e.target.value)} />
          </div>
        ))}
        <button onClick={addStep}>Add Step</button>
      </div>

      <div>
        <label>Shopping List:</label>
        {shopping.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px' }}>
            <input type="text" placeholder="Item" value={item.item} onChange={(e) => updateShoppingItem(index, 'item', e.target.value)} />
            <input type="number" placeholder="quantity" value={item.quantity} onChange={(e) => updateShoppingItem(index, 'quantity', parseFloat(e.target.value))} />
            <input type="text" placeholder="Unit (e.g., kg, g, ml)" value={item.unit} onChange={(e) => updateShoppingItem(index, 'unit', e.target.value)} />
          </div>
        ))}
        <button onClick={addShoppingItem}>Add Shopping Item</button>
      </div>

      <div>
        <label>Schedule Stream Date:</label>
        <input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
      </div>

      <button onClick={uploadRecipe}>Upload Recipe</button>

      <div>
        <h4>Uploaded Recipes</h4>
        <ul>
          {recipes.map((recipe, i) => (
            <li key={i}>
              <strong>{recipe.title}</strong>
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

  const updateStep = (stepNum : number, newDesc : string) => {
    setEditingRecipe(prev => prev ? ({
      ...prev,
      steps: prev.steps.map(step => 
        step.stepNum === stepNum ? { ...step, stepDesc: newDesc } : step
      )
    }) : prev);
  };

  const updateShoppingItem = (index: number, field: string, value: string | number) => {
    setEditingRecipe(prev => prev ? ({
      ...prev,
      shoppingList: prev.shoppingList.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }) : null);
  };

const addStep = () => {
  setEditingRecipe(prev => prev ? ({
    ...prev,
    steps: [...prev.steps, { 
      stepNum: prev.steps.length + 1, 
      stepDesc: '' 
    }]
  }) : prev);
};

const deleteStep = (stepNum: number) => {
  setEditingRecipe(prev => prev ? ({
    ...prev,
    steps: prev.steps
      .filter(step => step.stepNum !== stepNum)
      .map((step, idx) => ({ ...step, stepNum: idx + 1 }))
  }) : prev);
};

const addShoppingItem = () => {
  setEditingRecipe(prev => prev ? ({
    ...prev,
    shoppingList: [...prev.shoppingList, { item: '', amount: 0, unit: '' }]
  }) : prev);
};

const deleteShoppingItem = (index: number) => {
  setEditingRecipe(prev => prev ? ({
    ...prev,
    shoppingList: prev.shoppingList.filter((_, i) => i !== index)
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
        <Card sx={{ mb: 3 }} key={recipe.id}>
          <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>{recipe.title}</Typography>
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
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 2 }}>
              <AccessTime sx={{ mr: 1 }} />
              <Typography variant="body2">{formatDate(recipe.date)}</Typography>
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
                      <ListItem key={step.stepNum}>
                        <ListItemText
                          primary={
                            <Typography>
                              <strong>{step.stepNum}.</strong> {step.stepDesc}
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
                    {recipe.shoppingList?.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={item.item}
                            secondary={`${item.amount} ${item.unit}`}
                          />
                        </ListItem>
                        {index < recipe.shoppingList.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              </Grid>
            </Grid>
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
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="h6">Steps</Typography>
              <Button startIcon={<Add />} onClick={addStep}>Add Step</Button>
            </Box>
            {editingRecipe.steps.map((step) => (
              <Box key={step.stepNum} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label={`Step ${step.stepNum}`}
                  value={step.stepDesc}
                  onChange={(e) => updateStep(step.stepNum, e.target.value)}
                  margin="normal"
                />
                <IconButton onClick={() => deleteStep(step.stepNum)}>
                  <Delete />
                </IconButton>
              </Box>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="h6">Shopping List</Typography>
              <Button startIcon={<Add />} onClick={addShoppingItem}>Add Item</Button>
            </Box>
            {editingRecipe.shoppingList.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                <TextField
                  label="Item"
                  value={item.item}
                  onChange={(e) => updateShoppingItem(index, 'item', e.target.value)}
                />
                <TextField
                  label="Amount"
                  type="number"
                  value={item.amount}
                  onChange={(e) => updateShoppingItem(index, 'amount', parseFloat(e.target.value))}
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