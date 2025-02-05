import {
    CREATE_REPORT,
    DELETE_REPORT,
    FETCH_REPORTS,
    UPDATE_REPORT
} from '../actions/types'

interface IState {
    items: any[],
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

export const reportReducer = (state: IState = initialState, action: IAction) => {
    switch (action.type) {
        case FETCH_REPORTS:
            return {
                ...state,
                items: action.payload
            }
        case CREATE_REPORT:
            return {
                ...state,
                items: [action.payload, ...state.items],
                item: action.payload
            }
        case UPDATE_REPORT:
            return {
                ...state,
                items: state.items.reduce((acc: any[], item: any, index: number) => {
                    acc.push(item.id === action.payload.id ? action.payload : item)
                    return acc
                }, []),
                item: action.payload
            }
        case DELETE_REPORT:
            return {
                ...state,
                items: state.items.filter((item: any) => {
                    return item.id !== action.payload.id
                }),
                item: action.payload
            }
        default:
            return state
    }
}
