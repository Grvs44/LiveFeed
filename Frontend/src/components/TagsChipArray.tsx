import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react'

//TO-DO: Custom colours for the chips?
export default function TagsChipArray(){
    const [tags, setTags] = React.useState(['Tag1', 'Tag2', 'Tag3'])
    const [inputValue, setInputValue] = React.useState('')

    const handleDelete = (tagToDelete: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete))
    }

    const handleAddTag = () => {
        if (inputValue && !tags.includes(inputValue)) {
            setTags([...tags, inputValue])
        setInputValue('')
        }
    }
    
    return (
        <Box sx={{ marginTop: '40px', marginBottom: '40px' }}>
          <Box sx={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
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
              <TextField
                size="small"
                variant="outlined"
                label="Add Tag"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddTag}>
                Add
              </Button>
            </Box>
          </Box>
        </Box>
      );

}