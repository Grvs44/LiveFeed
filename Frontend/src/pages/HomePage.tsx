import React from 'react'
import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/titleSlice'
import Section from '../containers/Section';
import { Item } from '../redux/types'

// Dummy data
const liveStreams: Item[] = [
  { id: 1, title: 'Cooking Show', thumbnail: 'https://via.placeholder.com/300x250', link: '/live/1' },
  { id: 2, title: 'Gaming Live', thumbnail: 'https://via.placeholder.com/300x250', link: '/live/1' },
  { id: 3, title: 'Art Stream', thumbnail: 'https://via.placeholder.com/300x250', link: '/live/1' },
  { id: 4, title: 'Just Chatting', thumbnail: 'https://via.placeholder.com/300x250', link: '/live/1' },
];

const onDemandStreams: Item[] = [
  { id: 5, title: 'Recorded Cooking', thumbnail: 'https://via.placeholder.com/300x250', link: '/ondemand/1' },
  { id: 6, title: 'Gaming Highlights', thumbnail: 'https://via.placeholder.com/300x250', link: '/ondemand/1' },
  { id: 7, title: 'Music Replay', thumbnail: 'https://via.placeholder.com/300x250', link: '/ondemand/1' },
];

export default function HomePage() {

  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(setTitle('LiveFeed'))
  }, [])

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
      <div style={{ width: '80%', maxWidth: '1500px' }}>
        <Section title="On Demand" items={onDemandStreams} />
      </div>
    </div>
  );
}
