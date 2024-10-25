import {createSlice} from "@reduxjs/toolkit";

//initializing initial state of authslice 
const initialState={
    token:null,
    loading:false,
    role:null
};

const authSlice=createSlice({
    name:"auth",
    initialState,

    reducers:{
        //function to deal with state of authslice 
        setToken(state,value){
            state.token=value.payload;
        },
        setLoading(state,value){
            state.loading=value.payload;
        },
        clearToken(state) {
            state.token = null;
            // localStorage.removeItem("token");
        },
        setRole:(state,actions)=>{
            state.role=actions.payload;
        }
    },
});

// exporting required functionalities
export const {setToken,setLoading,clearToken,setRole}=authSlice.actions;
export default authSlice.reducer;