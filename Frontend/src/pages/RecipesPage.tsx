import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/titleSlice'
import { NumericLiteral } from 'typescript';

export default function RecipesPage() {
  const dispatch = useDispatch()

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
  const [recipes, setRecipes] = useState<{title: string; steps: { stepNum: number; stepDesc: string }[]}[]>([]);
  const [title, setTitle] = useState<string>('');
  const [steps, setSteps] = useState<{ stepNum: number; stepDesc: string }[]>([]);

  const addStep = () => {
    setSteps([...steps, { stepNum: steps.length + 1, stepDesc: '' }]);
  };

  const addStepDesc = (stepCount: number, stepSentence: string) => {
    const updatedSteps = [...steps]; 
    for (let i = 0; i < updatedSteps.length; i++) {
      if (updatedSteps[i].stepNum === stepCount) {
        updatedSteps[i] = { ...updatedSteps[i], stepDesc: stepSentence };
        break;
      }
    }
    setSteps(updatedSteps);
  };

  const uploadRecipe = () => {
    if (title && steps.length > 0) {
      const newRecipe = { title, steps };
      setRecipes([...recipes, newRecipe]);
      setTitle('');
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
          <div key={step.stepNum}>
            <input type="text" placeholder={`Step ${step.stepNum}`} value={step.stepDesc} onChange={(e) => addStepDesc(step.stepNum, e.target.value)} />
          </div>
        ))}
        <button onClick={addStep}>Add Step</button>
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
                  <li key={step.stepNum}>{step.stepDesc}</li>
                ))}
              </ol>
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
