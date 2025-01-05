import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTitle } from '../redux/titleSlice';
import { Recipe } from '../redux/types';
import  {RecipeList}  from '../components/RecipeList';

interface RecipeListContainerProps {
  fetchRecipes: () => Promise<Recipe[]>;
  pageTitle: string;
}

export const RecipeListContainer: React.FC<RecipeListContainerProps> = ({
  fetchRecipes,
  pageTitle
}) => {
  const dispatch = useDispatch();
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(setTitle(pageTitle));
    loadRecipes();
  }, [dispatch, pageTitle]);

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const recipes = await fetchRecipes();
      setRecipeList(recipes);
    } catch (error) {
      console.error("Error loading recipes:", error);
      setError("Failed to load recipes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  return <RecipeList recipes={recipeList} />;
};