import { FETCH_CHECKIN_STATUS, CHECK_IN } from '../actions/types'
import { CheckInStatus } from '../types/checkin'

interface IState {
    status: CheckInStatus
}

const initialState: IState = {
    status: {
        date: null,
        blocks: []
    }
}

interface IAction {
    type: string,
    payload: any
}

export const checkinReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case FETCH_CHECKIN_STATUS:
            return {
                status: action.payload
            }
        default:
            return state
    }
}
