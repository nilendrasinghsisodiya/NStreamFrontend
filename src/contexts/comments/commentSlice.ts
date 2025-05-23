import { createSlice,PayloadAction} from "@reduxjs/toolkit";
import { RootState } from "@/ContextStore";

const initialState: IComment[]|[]= [];
const comment = createSlice({
    name:"comments",
    initialState,
    reducers:{
        resetComments:(state)=>{
          Object.assign(state, initialState);
        },
        setComments:(state,action:PayloadAction<IComment[]>)=>{
            Object.assign(state,action.payload);
        }
    }
    
})

export const {setComments ,resetComments} = comment.actions;

export const selectComments = (state:RootState)=> state.comments;
export default comment.reducer;
