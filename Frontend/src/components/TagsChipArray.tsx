import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import TAGS from '../config/Tags'

//TO-DO: Custom colours for the chips?
export default function TagsChipArray() {
  const [tags, setTags] = React.useState<string[]>([])
  const [selectedTag, setSelectedTag] = React.useState<string>('')

  const handleDelete = (tagToDelete: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete))
  }

  const handleAddTag = () => {
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag])
      setSelectedTag('')
    }
  }

  return (
    <Box sx={{ marginTop: '40px', marginBottom: '40px' }}>
      <Box
        sx={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}
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
            onClick={handleAddTag}
            disabled={!selectedTag}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
