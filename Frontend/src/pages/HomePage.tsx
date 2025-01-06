import React, { useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTitle } from '../redux/titleSlice';
import Section from '../containers/Section';
import { Item } from '../redux/types';
import '../assets/HomePage.css';
import {
  useGetLiveRecipeMutation,
  useGetOnDemandRecipeMutation,
  useGetUpcomingRecipeMutation,
} from '../redux/apiSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const location = useLocation(); // Track current route
  const { searchQuery, setSearchQuery } = useOutletContext<{
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  }>();

  const [fetchLiveStreams, { data: liveData }] = useGetLiveRecipeMutation();
  const [fetchOnDemandStreams, { data: onDemandData }] = useGetOnDemandRecipeMutation();
  const [fetchUpcomingStreams, { data: upcomingData }] = useGetUpcomingRecipeMutation();

  // Fetch data on component mount
  useEffect(() => {
    dispatch(setTitle('LiveFeed'));
    fetchLiveStreams();
    fetchOnDemandStreams();
    fetchUpcomingStreams();
  }, [dispatch, fetchLiveStreams, fetchOnDemandStreams, fetchUpcomingStreams]);

  if (location.pathname === '/' && searchQuery === null){
    
  }

  // Clear searchQuery ONLY when navigating to the homepage from another tab
  useEffect(() => {
    if (location.pathname === '/' && searchQuery === null) {
      setSearchQuery(''); // Reset only if no active query exists
    }
  }, [location.pathname, searchQuery, setSearchQuery]);

  const liveStreams: Item[] =
    liveData?.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      thumbnail: recipe.image,
      tags: recipe.tags,
      link: `/live/${recipe.id}`,
    })) || [];

  const onDemandStreams: Item[] = 
    onDemandData?.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      thumbnail: recipe.image,
      tags: recipe.tags,
      link: `/ondemand/${recipe.id}`,
    })) || [];

  const upcomingStreams: Item[] =
    upcomingData?.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      thumbnail: recipe.image,
      tags: recipe.tags,
      link: `/upcoming/${recipe.id}`,
    })) || [];

  // Apply filtering logic based on search query
  const filteredLiveStreams = searchQuery
    ? liveStreams.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : liveStreams;

  const filteredOnDemandStreams = searchQuery
    ? onDemandStreams.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : onDemandStreams;

  const filteredUpcomingStreams = searchQuery
    ? upcomingStreams.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : upcomingStreams;

  return (
    <div className="homePageContainer">
      {/* Live Section */}
      <div className="sectionWrapper" style={{ marginBottom: '50px' }}>
        <Section title="Live" items={filteredLiveStreams} />
      </div>

      {/* On-Demand Section */}
      <div className="sectionWrapper" style={{ marginBottom: '50px' }}>
        <Section title="On Demand" items={filteredOnDemandStreams} />
      </div>

      {/* Upcoming Section */}
      <div className="sectionWrapper">
        <Section title="Upcoming" items={filteredUpcomingStreams} />
      </div>
    </div>
  );
}
