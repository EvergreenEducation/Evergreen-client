import { keyBy } from 'lodash';

export default (currentState, setState) => {
  let idKey = currentState.idKey;

  const addOne = (payload) => {
    addMany([payload]);
  }

  const addMany = (payload) => {
    setState(currentState => {
      let newItems = keyBy(payload, idKey);

      return {
        entities: {
          ...currentState.entities,
          ...newItems
        },
        items: Object.keys(newItems) 
      }
    });
  }

  const removeOne = (payload) => {
    setState(currentState => {
      let newEntities = {
        ...currentState.entities,
      }

      delete newEntities[payload[idKey]];

      return {
        entities: newEntities,
        items: Object.keys(newEntities)
      }
    });
  }

  const addAll = (payload) => {
    setState(currentState => {
      let newEntities = keyBy(payload, idKey);

      return {
        entities: newEntities,
        items: Object.keys(newEntities)
      }
    });
  }

  const removeAll = (payload) => {
    setState({
      entities: {},
      items: []
    })
  }

  return {
    removeAll, 
    removeOne, 
    addOne, 
    addMany, 
    addAll, 
    updateMany: addMany, 
    updateOne: addOne
  }
}
