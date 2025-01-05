import React from 'react';
import { useGetUpcomingRecipeMutation } from '../redux/apiSlice';
import { RecipeListContainer } from '../containers/RecipeListBox';

export default function UpcomingRecipesPage() {
  const [getRecipe] = useGetUpcomingRecipeMutation();

  const fetchUpcomingRecipes = async () => {
    const response = await getRecipe().unwrap();
    return response;
  };

  return (
    <RecipeListContainer
      fetchRecipes={fetchUpcomingRecipes}
      pageTitle="Upcoming List"
    />
  );
}