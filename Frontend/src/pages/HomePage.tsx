import React from 'react'
import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/titleSlice'
import Section from '../containers/Section';
import { Item } from '../redux/types'
import { useGetLiveRecipeMutation, useGetOnDemandRecipeMutation, useGetUpcomingRecipeMutation } from '../redux/apiSlice';

export default function HomePage() {

  const dispatch = useDispatch()

  const [fetchLiveStreams, { data: liveData }] = useGetLiveRecipeMutation()
  const [fetchOnDemandStreams, { data: onDemandData }] = useGetOnDemandRecipeMutation()
  const [fetchUpcomingStreams, { data: upcomingData }] = useGetUpcomingRecipeMutation()

  React.useEffect(() => {
    dispatch(setTitle('LiveFeed'))
    fetchLiveStreams()
    fetchOnDemandStreams()
    fetchUpcomingStreams()
  }, [dispatch, fetchLiveStreams, fetchOnDemandStreams, fetchUpcomingStreams])

  const liveStreams: Item[] = 
  liveData?.map((recipe: any) => ({
    id: recipe.id,
    title: recipe.title,
    thumbnail: recipe.image,
    tags: recipe.tags,
    link: `/live/${recipe.id}`,
  })) || []

  const onDemandStreams: Item[] = 
  onDemandData?.map((recipe: any) => ({
    id: recipe.id,
    title: recipe.title,
    thumbnail: recipe.image,
    tags: recipe.tags,
    link: `/ondemand/${recipe.id}`,
  })) || []

  const upcomingStreams: Item[] =
  upcomingData?.map((recipe: any) => ({
    id: recipe.id,
    title: recipe.title,
    thumbnail: recipe.image,
    tags: recipe.tags,
    link: `/upcoming/${recipe.id}`,
  })) || []


  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        margin: '0 auto', // Ensures content stays centered
        padding: '20px 0', // Adds vertical padding
        boxSizing: 'border-box',
      }}
    >
      {/* Live Section */}
      <div style={{ width: '80%', maxWidth: '1500px', marginBottom: '50px' }}>
        <Section title="Live" items={liveStreams} />
      </div>

      {/* On-Demand Section */}
      <div style={{ width: '80%', maxWidth: '1500px', marginBottom: '50px' }}>
        <Section title="On Demand" items={onDemandStreams} />
      </div>

      {/* Upcoming Section */}
      <div style={{ width: '80%', maxWidth: '1500px' }}>
        <Section title="Upcoming" items={upcomingStreams} />
      </div>
    </div>
  );
}
