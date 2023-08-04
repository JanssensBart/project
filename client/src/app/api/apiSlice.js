import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../../features/auth/authSlice';

// dit is de 'parent' voor alle andere api-slices

const baseQuery = fetchBaseQuery(
    {
        baseUrl: 'http://localhost:3500',
        credentials: 'include',
        prepareHeaders: (headers , { getState }) => {
            const token = getState().auth.token
            if(token) {
                headers.set('authorization' , `Bearer ${token}`)
            }
            return headers
        }
    });

const baseQueryWithReauth = async(args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if(result?.error?.originalStatus === 403) {
        console.log('send refresh token to get new access token')
        // send refresh token to get new acces token
        const refreshResult = await baseQuery('/api/users/refresh', api, extraOptions)
        if(refreshResult?.data) {
            const userInfo = api.getState().auth.userInfo
            // store the new token
            api.dispatch(setCredentials(...refreshResult.data, userInfo)) 
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logout())
        }
    }
    return result
}


export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User'], // products,blogposts kunnen hier ook in
    endpoints: (builder)=> ({})
});
