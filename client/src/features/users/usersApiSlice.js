import { apiSlice } from "../../app/api/apiSlice";

//endpoint(s)
const USERS_URL = '/api/users'

// injectEndpoints : word geinjecteerd in apiSlice-endpoints-builder
export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: {...credentials},
            }),
        }),
        logout : builder.mutation ({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                body: data,
            }),
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),
        
    }),
});

// naming convention voor export: use[NAME]Mutation for sending
// naming convention voor export: use[NAME]Query for fetching

export const { 
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useUpdateUserMutation,
 } = userApiSlice