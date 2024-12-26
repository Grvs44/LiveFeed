import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import { useStartStreamMutation } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'
import { useCreateRecipeMutation } from '../redux/apiSlice';


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


function RecipeManagement() {
  return (
    <div>
      <p>Recipe Manage</p>
    </div>
  );
}
