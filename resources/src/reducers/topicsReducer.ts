import { FETCH_TOPICS, CREATE_TOPIC, DELETE_TOPIC } from '../actions/types'

interface IState {
    items: any[]
    item: any
}

const initialState: IState = {
    items: [],
    item: {}
}

interface IAction {
    type: string
    payload: any
}

export const topicsReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case FETCH_TOPICS:
            return {
                ...state,
                items: action.payload
            }
        case CREATE_TOPIC:
            return {
                ...state,
                item: action.payload
            }
        case DELETE_TOPIC:
            return {
                ...state,
                items: state.items.filter((item: any) => (
                    item.id !== action.payload.id
                ))
            }
        default:
            return state
    }
}
