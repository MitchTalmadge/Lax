import { combineReducers } from 'redux'
import { REQUEST_CONNECTION } from '../actions'

function list (state = [], { type, payload }) {
  switch (type) {
    case REQUEST_CONNECTION.PENDING:
      return state.concat([ payload ])
    case REQUEST_CONNECTION.SUCCESS:
      return updateIdInList(state, payload.id, {
        isConnected: true
      })
    case REQUEST_CONNECTION.ERROR:
      return updateIdInList(state, payload.id, {
        error: payload.error
      })
    default:
      return state
  }
}

function updateIdInList (state, id, update) {
  return state.map(connection => {
    if (connection.id === id) {
      return Object.assign({}, connection, update)
    } else {
      return connection
    }
  })
}

export default combineReducers({
  list
})
