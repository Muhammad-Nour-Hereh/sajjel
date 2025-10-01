import { useReducer } from 'react'

type StackAction<T> =
  | { type: 'push'; item: T }
  | { type: 'pop' }
  | { type: 'clear' }

const stackReducer = <T>(state: T[], action: StackAction<T>): T[] => {
  switch (action.type) {
    case 'push':
      return [...state, action.item]
    case 'pop':
      return state.length ? state.slice(0, -1) : state
    case 'clear':
      return []
    default:
      return state
  }
}

const useStack = <T>(initial: T[] = []) => {
  const [stack, dispatch] = useReducer(stackReducer<T>, initial)

  const push = (item: T) => dispatch({ type: 'push', item })
  const pop = () => dispatch({ type: 'pop' })
  const clear = () => dispatch({ type: 'clear' })
  const top = () => (stack.length ? stack[stack.length - 1] : null)
  const canPop = stack.length > 0

  return { stack, push, pop, top, clear, canPop }
}

export default useStack
