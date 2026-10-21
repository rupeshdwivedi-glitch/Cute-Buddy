import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import apiClient, { TOKEN_KEY, getApiErrorMessage } from '../utils/apiClient'

export type AuthUser = {
  id: number
  email: string
  full_name: string | null
  is_active: boolean
  role: string
  created_at: string
}

type AuthState = {
  token: string | null
  user: AuthUser | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  status: 'idle',
  error: null,
}

const loginRequest = async (email: string, password: string) => {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)
  const { data: tokenData } = await apiClient.post('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  localStorage.setItem(TOKEN_KEY, tokenData.access_token)
  const { data: user } = await apiClient.get('/auth/me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })
  return { token: tokenData.access_token as string, user: user as AuthUser }
}

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await loginRequest(data.email, data.password)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error))
    }
  }
)

export const signup = createAsyncThunk(
  'auth/signup',
  async (
    data: { email: string; password: string; full_name?: string },
    { rejectWithValue }
  ) => {
    try {
      await apiClient.post('/auth/signup', data)
      return await loginRequest(data.email, data.password)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error))
    }
  }
)

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_: void, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/auth/me')
      return data as AuthUser
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error))
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      state.status = 'idle'
      state.error = null
      localStorage.removeItem(TOKEN_KEY)
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      .addCase(signup.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(fetchCurrentUser.rejected, state => {
        state.token = null
        state.user = null
        localStorage.removeItem(TOKEN_KEY)
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
