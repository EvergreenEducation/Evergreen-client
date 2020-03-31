import { useState } from "react";
import CrudHelper from "./CrudHelper";
import { createContainer } from "unstated-next";

const initialState = {
	idKey: 'id',
	entities: {},
	items: []
}

function useType() {
	let [ state, setState ] = useState(initialState);

	return { 
		entities: state.entities,
		items: state.items,
		...CrudHelper(state, setState),
		typeEqualsProvider: function(datafield) {
			return datafield.type === 'provider';
		},
		typeEqualsTopic: function(datafield) {
			return datafield.type === 'topic';
		}
	}
}

export default createContainer(useType);
