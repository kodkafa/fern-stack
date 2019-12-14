import {DATA, ERROR, FILE, SUCCESS} from 'actions/Types';

export const reducer = (state = {}, action) => {
  console.log('reducer', state, action);
  switch (action.type) {
    case SUCCESS:
      return {...state, error: '', message: action.payload};
    case DATA:
      return {...state, error: '', message: '', data: action.payload};
    case FILE:
      return {...state, error: '', message: '', file: action.payload};
    case ERROR:
      console.log('reducers ERROR', state, action.payload);
      if (action.payload === false && state.error && state.error.length)
        state.error.pop();
      else if (state.error && state.error.length)
        state.error.push(action.payload);
      else
        state.error = [action.payload];
      return {...state, message: ''};
    default:
      return state;
  }
};
