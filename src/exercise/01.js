// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

// const countReducer = (currentState, step) => currentState + step;
//
// function Counter({initialCount = 0, step = 1}) {
//   // 🐨 replace React.useState with React.useReducer.
//   // 💰 React.useReducer(countReducer, initialCount)
//   const [count, changeCount] = React.useReducer(countReducer, initialCount)
//
//   // 💰 you can write the countReducer function so you don't have to make any
//   // changes to the next two lines of code! Remember:
//   // The 1st argument is called "state" - the current value of count
//   // The 2nd argument is called "newState" - the value passed to setCount
//   const increment = () => changeCount(step)
//   return <button onClick={increment}>{count}</button>
// }

// const countReducer = (currentState, action) => {
//   return {...currentState, ...(typeof action === 'function' ? action(currentState) : action) };
// }
//
// function Counter({ initialCount = 0, step = 1 }) {
//   const [state, setState] = React.useReducer(countReducer, { count: initialCount })
//
//   const increment = () => setState(p => ({ count: p.count + step }));
//   return <button onClick={increment}>{state.count}</button>
// }

const countReducer = (currentState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: currentState.count + action.step };
    default:
      return currentState;
  }
}

function Counter({ initialCount = 0, step = 1 }) {
  const [state, dispatch] = React.useReducer(countReducer, { count: initialCount })

  const increment = () => dispatch({ type: 'INCREMENT', step });
  return <button onClick={increment}>{state.count}</button>
}

function App() {
  return <Counter />
}

export default App
