import { useState } from 'react';
import CrudHelper from './CrudHelper';
import { createContainer } from 'unstated-next';

const initialState = {
  idKey: 'id',
  entities: {},
  items: [],
};

function useStudent() {
  let [state, setState] = useState(initialState);

  return {
    entities: state.entities,
    items: state.items,
    ...CrudHelper(state, setState),
  };
}

export default createContainer(useStudent);
