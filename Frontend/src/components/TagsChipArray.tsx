import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import TAGS from '../config/Tags'
import {
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
} from '../redux/apiSlice'
import { addTag, removeTag, setTags } from '../redux/tagsSlice'
import { State } from '../redux/types'

//TO-DO: Custom colours for the chips?
export default function TagsChipArray() {
  const dispatch = useDispatch()
  const [updatePreferences] = useUpdatePreferencesMutation()
  const { data, isLoading } = useGetPreferencesQuery()
  const tags = useSelector((state: State) => state.tags.tags || [])
  const [selectedTag, setSelectedTag] = React.useState<string>('')

  React.useEffect(() => {
    console.log('API Response for Preferences:', data)
    if (data && data.tags) {
      dispatch(setTags(data.tags))
    }
  }, [data, dispatch])
  if (isLoading) {
    return <p>Loading preferences...</p>
  }

  const handleAddTag = (tagToAdd: string) => {
    dispatch(addTag(tagToAdd))
  }

  const handleDelete = (tagToDelete: string) => {
    dispatch(removeTag(tagToDelete))
  }

  const handleSaveChanges = async () => {
    try {
      updatePreferences({
        tags,
      })
    } catch (err) {
      console.error('Failed to update preferences:', err)
      alert('Failed to save preferences.')
    }
  }

  return (
    <Box sx={{ marginTop: '40px', marginBottom: '40px' }}>
      <Box
        sx={{
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          position: 'relative',
        }}
      >
        <Typography variant="h6" sx={{ fontSize: '1.125rem' }} gutterBottom>
          Recipe Preferences
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleDelete(tag)}
              color="primary"
              sx={{ fontSize: '1rem', height: '40px' }}
            />
          ))}
        </Stack>
        <Box sx={{ display: 'flex', marginTop: '20px', gap: '10px' }}>
          <Select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            displayEmpty
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="" disabled>
              Select a Tag
            </MenuItem>
            {TAGS.map((tag) => (
              <MenuItem
                key={tag.id}
                value={tag.name}
                disabled={tags.includes(tag.name)}
              >
                {tag.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            onClick={() => handleAddTag(selectedTag)}
            disabled={!selectedTag}
          >
            Add
          </Button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '40px',
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
