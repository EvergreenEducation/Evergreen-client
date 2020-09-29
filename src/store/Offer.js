import { useState } from 'react'
import CrudHelper from './CrudHelper';
import { createContainer } from 'unstated-next'
const pdf_link ={}
// export default createContainer(pdf_link)

const initialState = {
  idKey: 'id',
  entities: {},
  items: []
}

function useOffer() {
  let [ state, setState ] = useState(initialState);

  return { 
    entities: state.entities,
    items: state.items,
    ...CrudHelper(state, setState)
  }
}

export default createContainer(useOffer);
