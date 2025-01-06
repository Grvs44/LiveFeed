import { createSlice } from '@reduxjs/toolkit'
import { TagsState } from './types'

const initialState: TagsState = {}

export const tagsSlice = createSlice({
    name: 'tags',
    initialState,
    reducers:{
        setTags(state, action:{payload: TagsState['tags']}){
            state.tags = action.payload
        },
        addTag(state, action:{payload: string}){
            if (!state.tags){
                state.tags = [action.payload];
            }
            if (state.tags && !state.tags.includes(action.payload)){
                state.tags = [...state.tags, action.payload];
            }
        },
        removeTag(state, action: { payload: string }) {
            if (state.tags) {
              state.tags = state.tags.filter(tag => tag !== action.payload);
            }
        }
    },
})

export const { setTags, addTag, removeTag } = tagsSlice.actions

export default tagsSlice.reducer