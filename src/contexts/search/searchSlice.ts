import { createSlice,PayloadAction} from "@reduxjs/toolkit";
import { RootState } from "@/ContextStore";
export interface searchStateType  {
    query:string;
    type:"chnl"|"vid";
}
const initialState :searchStateType={
    query: "",
    type:"vid"
}
const search = createSlice({
    name:"search",
    initialState,
    reducers:{
        resetSearch:(state)=>{
          Object.assign(state, initialState);
        },
        setSearch:(state,action:PayloadAction<searchStateType>)=>{
            Object.assign(state,action.payload);
        }
    }
    
})

export const {setSearch,resetSearch} = search.actions;

export const selectSearch = (state:RootState)=> state.search;
export default search.reducer;
