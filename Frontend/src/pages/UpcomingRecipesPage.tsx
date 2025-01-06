import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setTitle } from '../redux/titleSlice';
import { useDisplayRecipeMutation } from '../redux/apiSlice';
import { Recipe } from '../redux/types';
import { RecipeListContainer } from '../containers/RecipeListBox';


export default function UpcomingRecipesPage() {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [displayRecipe] = useDisplayRecipeMutation();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  React.useEffect(() => {
    dispatch(setTitle('Upcoming Recipes'));
    console.log("Recipe updated:", recipe?.title);
  }, [dispatch, id]);

  const fetchRecipes = async () => {
    try {
      if (!id) return [];
      const response = await displayRecipe(id).unwrap();
      console.log("Recipe:", response);
      console.log("Recipe Title:", response.title);
      setRecipe(response);
      return [response];
    } catch (error) {
      console.error("Error getting recipe list:", error);
      return [];
    }
  };
  

  return (
    <RecipeListContainer
      fetchRecipes={fetchRecipes}
      pageTitle="Upcoming Recipes"
    />
  );
}

