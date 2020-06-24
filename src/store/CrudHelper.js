import { keyBy } from 'lodash';

export default (currentState, setState) => {
  const addOne = (payload) => {
    addMany([payload]);
  };

  const addMany = (payload) => {
    setState((currentState) => {
      let idKey = currentState.idKey;
      let newItems = keyBy(payload, idKey);
      return {
        ...currentState,
        entities: {
          ...currentState.entities,
          ...newItems,
        },
        items: Object.keys(newItems),
      };
    });
  };

  const removeOne = (payload) => {
    setState((currentState) => {
      let idKey = currentState.idKey;
      let newEntities = {
        ...currentState.entities,
      };

      delete newEntities[payload[idKey]];

      return {
        ...currentState,
        entities: newEntities,
        items: Object.keys(newEntities),
      };
    });
  };

  const removeOneByIdKey = (idKey) => {
    setState((currentState) => {
      let newEntities = {
        ...currentState.entities,
      };

      delete newEntities[idKey];

      return {
        ...currentState,
        entities: newEntities,
        items: Object.keys(newEntities),
      };
    });
  };

  const addAll = (payload) => {
    setState((currentState) => {
      let idKey = currentState.idKey;
      let newEntities = keyBy(payload, idKey);

      return {
        ...currentState,
        entities: newEntities,
        items: Object.keys(newEntities),
      };
    });
  };

  const removeAll = (payload) => {
    setState({
      entities: {},
      items: [],
    });
  };

  return {
    removeAll,
    removeOne,
    addOne,
    addMany,
    addAll,
    updateMany: addMany,
    updateOne: addOne,
    removeOneByIdKey,
  };
};
