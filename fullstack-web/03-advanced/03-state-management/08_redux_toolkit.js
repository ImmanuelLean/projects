// ============================================
// REDUX TOOLKIT — MODERN STATE MANAGEMENT
// ============================================
// npm install @reduxjs/toolkit react-redux

// ---- 1. CORE CONCEPTS ----

const coreConcepts = `
  Redux Flow:
    UI → dispatch(action) → reducer → new state → UI re-renders

  Redux Toolkit simplifies:
    - configureStore: replaces createStore + middleware setup
    - createSlice: replaces action creators + reducers
    - createAsyncThunk: replaces manual async action logic
    - RTK Query: replaces manual data fetching logic
`;

// ---- 2. STORE SETUP ----

const storeSetup = `
// store.js
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './features/todosSlice';
import authReducer from './features/authSlice';
import cartReducer from './features/cartSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    auth: authReducer,
    cart: cartReducer,
  },
  // Middleware is auto-configured (thunk, serializability check, immutability check)
});

// App.jsx
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <MyApp />
    </Provider>
  );
}
`;

// ---- 3. createSlice ----

const createSliceExample = `
// features/todosSlice.js
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    filter: 'all',  // 'all' | 'active' | 'completed'
  },

  // Reducers: Immer allows "mutating" syntax (it's actually immutable under the hood)
  reducers: {
    addTodo: (state, action) => {
      state.items.push({
        id: Date.now(),
        text: action.payload,
        completed: false,
      });
    },

    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },

    removeTodo: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },

    editTodo: (state, action) => {
      const { id, text } = action.payload;
      const todo = state.items.find(t => t.id === id);
      if (todo) todo.text = text;
    },

    setFilter: (state, action) => {
      state.filter = action.payload;
    },

    clearCompleted: (state) => {
      state.items = state.items.filter(t => !t.completed);
    },

    // Prepare callback: customize action payload
    addTodoWithPriority: {
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
      prepare: (text, priority = 'normal') => ({
        payload: {
          id: Date.now(),
          text,
          priority,
          completed: false,
        },
      }),
    },
  },
});

// Auto-generated action creators
export const {
  addTodo, toggleTodo, removeTodo, editTodo,
  setFilter, clearCompleted, addTodoWithPriority,
} = todosSlice.actions;

// Selectors
export const selectAllTodos = (state) => state.todos.items;
export const selectFilter = (state) => state.todos.filter;
export const selectFilteredTodos = (state) => {
  const { items, filter } = state.todos;
  switch (filter) {
    case 'active': return items.filter(t => !t.completed);
    case 'completed': return items.filter(t => t.completed);
    default: return items;
  }
};
export const selectTodoCount = (state) => state.todos.items.length;

export default todosSlice.reducer;
`;

// ---- 4. USING IN COMPONENTS ----

const usingInComponents = `
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleTodo, removeTodo, selectFilteredTodos } from './todosSlice';

function TodoList() {
  const todos = useSelector(selectFilteredTodos);
  const dispatch = useDispatch();

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch(toggleTodo(todo.id))}
          />
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => dispatch(removeTodo(todo.id))}>×</button>
        </li>
      ))}
    </ul>
  );
}

function AddTodo() {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(addTodo(text.trim()));
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button>Add</button>
    </form>
  );
}
`;

// ---- 5. createAsyncThunk ----

const asyncThunk = `
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async action
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',     // action type prefix
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();  // returned as action.payload
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/create',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},

  // Handle async actions in extraReducers
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createUser
      .addCase(createUser.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

// Component usage
function UserList() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error}</p>;
  return items.map(u => <UserCard key={u.id} user={u} />);
}
`;

// ---- 6. RTK QUERY ----

const rtkQuery = `
// services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User', 'Post'],

  endpoints: (builder) => ({
    // GET /api/users
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),

    // GET /api/users/:id
    getUser: builder.query({
      query: (id) => \`/users/\${id}\`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // POST /api/users
    createUser: builder.mutation({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],  // refetch users list
    }),

    // PUT /api/users/:id
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: \`/users/\${id}\`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    // DELETE /api/users/:id
    deleteUser: builder.mutation({
      query: (id) => ({
        url: \`/users/\${id}\`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Auto-generated hooks!
export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = apiSlice;

// Component usage — zero boilerplate
function UserList() {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  if (isLoading) return <Spinner />;
  if (error) return <p>Error loading users</p>;

  return users.map(user => (
    <div key={user.id}>
      <span>{user.name}</span>
      <button onClick={() => deleteUser(user.id)}>Delete</button>
    </div>
  ));
}
`;

// ---- SUMMARY ----
console.log("=== Redux Toolkit Summary ===");
console.log(`
  Setup:       configureStore + createSlice
  Sync state:  createSlice (reducers + auto action creators)
  Async:       createAsyncThunk (extraReducers)
  Data fetch:  RTK Query (auto caching, invalidation, hooks)
  Components:  useSelector + useDispatch

  Best For:
    - Large apps with complex state
    - Team projects needing conventions
    - Apps with lots of server state (RTK Query)
    - When you need Redux DevTools
`);
