// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// 🐨 this is going to be our generic asyncReducer
function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      // 🐨 replace "pokemon" with "data" (in the action too!)
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'rejected', pokemon: action.data, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

// a hook to stop running the dispatch function if the component is unmounted
const useSafeDispatch = (dispatch) => {
  const mountedRef = React.useRef(false);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => mountedRef.current = false;
  }, [])

  return React.useCallback(
    (...args) => mountedRef.current ? dispatch(...args) : undefined,
    [dispatch]
  );
}

const useAsync = (initialState) => {
  const [ state, unsafeDispatch ] = React.useReducer(asyncReducer, initialState);

  const dispatch = useSafeDispatch(unsafeDispatch);

  const run = React.useCallback((promise) => {
    dispatch({ type: 'pending' });
    promise
      .then(data => dispatch({ type: 'resolved', data }))
      .catch(error => dispatch({ type: 'rejected', data: null, error }));
  }, [dispatch])

  return {...state, run };
}

function PokemonInfo({pokemonName}) {
  // 🐨 move all the code between the lines into a new useAsync function.
  // 💰 look below to see how the useAsync hook is supposed to be called
  // 💰 If you want some help, here's the function signature (or delete this
  // comment really quick if you don't want the spoiler)!
  // function useAsync(asyncCallback, initialState, dependencies) {/* code in here */}

  // -------------------------- start --------------------------

  // const [state, dispatch] = React.useReducer(pokemonInfoReducer, {
  //   status: pokemonName ? 'pending' : 'idle',
  //   // 🐨 this will need to be "data" instead of "pokemon"
  //   pokemon: null,
  //   error: null,
  // })
  //
  // React.useEffect(() => {
  //   // 💰 this first early-exit bit is a little tricky, so let me give you a hint:
  //   // const promise = asyncCallback()
  //   // if (!promise) {
  //   //   return
  //   // }
  //   // then you can dispatch and handle the promise etc...
  //   if (!pokemonName) {
  //     return
  //   }
  //   dispatch({type: 'pending'})
  //   fetchPokemon(pokemonName).then(
  //     pokemon => {
  //       dispatch({type: 'resolved', pokemon})
  //     },
  //     error => {
  //       dispatch({type: 'rejected', error})
  //     },
  //   )
  //   // 🐨 you'll accept dependencies as an array and pass that here.
  //   // 🐨 because of limitations with ESLint, you'll need to ignore
  //   // the react-hooks/exhaustive-deps rule. We'll fix this in an extra credit.
  // }, [pokemonName])
  


  // --------------------------- end ---------------------------

  const { data, error, status, run } = useAsync({ data: null, status: 'idle', error: null });

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    }

    const pokemonPromise = fetchPokemon(pokemonName);
    run(pokemonPromise);

  }, [pokemonName, run])


  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={data} />
    default:
      throw new Error('This should be impossible')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
