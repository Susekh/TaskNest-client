import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import memberSlice from "./MemberSlice"

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
    reducer : {
        user : userSlice,
        member : memberSlice
    },
});

export default store;

/*
*Create Store 
* - configureStore()
* 
* provide my store to app
*   - <Provider Store = {store} /> - Imported from react-redux
* 
* Slice
*   - RTK - const slice =  createSlice({
*           name : "",
*           initialState : 
*           reducers : {
*               actions : (state, action) => { state = action.payload }
*           }
*       });
*       export const { actions } = slice.actions;
*       export default slice.reducer;
* 
* put that slice into the store
*       - {
*           reducer : {
*               auth : authSlice,
*               user : userSlice
*           }
*}
* 
*/