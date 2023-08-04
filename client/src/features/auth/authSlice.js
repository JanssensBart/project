import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState : {
        userInfo: null,
        token: null
    },
    reducers:{
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload
            state.userInfo = user,
            state.token = accessToken
        },
        logout: (state,action) => {
            //clearing credentials on the frontend
            state.userInfo = null;
            state.token = null
        }
    }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.userInfo
export const selectCurrentToken = (state) => state.auth.token
