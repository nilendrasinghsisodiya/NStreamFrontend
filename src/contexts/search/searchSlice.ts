import { createSlice,PayloadAction} from "@reduxjs/toolkit";
import { RootState } from "@/ContextStore";
import { sortBy, sortType } from "@/api/VideoApi";
export interface searchStateType  {
    query:string;
    type:"chnl"|"vid";
    sortType:sortType,
    sortBy:sortBy,
    limit:number;

}
const initialState :searchStateType= {query:"",type:"vid",limit:10} as searchStateType;
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
