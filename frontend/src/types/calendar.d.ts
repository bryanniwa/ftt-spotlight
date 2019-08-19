import { IStaff } from './staff'
import { IStudent } from './student'

export interface IBlock {
    id: number
    flex: boolean
    label: string
}

export interface IBlockSchedule extends IBlock {
    day_of_week: number
    start: string
    end: string
}

/*
export interface ICalendarItemGroup {
    name: string
    items?: ICalendarItemDetails[]
    actions?: ICalendarItemAction[]
}
*/

export interface IBlockDetails {
	date: string
	start: string
	end: string
    flex: boolean
    label: string
	pending: boolean
	data: ICalendarItemData
}

interface ICalendarDay {
    blocks: ICalendarBlock[]
    date: ICalendarDate
    events: ICalendarEvent[]
}

type ICalendarEvent = any

type ICalendarBlock = IScheduleBlock & (IStudentBlock | IStaffBlock)

// Might change from here...
interface IScheduleBlock {
    id: number
    flex: boolean
    day_of_week: number
    start: string
    end: string
    pending: boolean
}

interface IStudentBlock {
    type: 'student'
    editable: boolean
}

interface IStaffBlock {
    type: 'staff'
}
// ... to here.

interface ICalendarDate {
    full_date: string
    date: number
    day: string
    is_today: boolean
}

export interface ICalendarItemDetails {
    id?: number
    variant: string
    title: string
    time?: string
    memo?: string
    method?: string
}

export interface ICalendarItemAction {
    value: string
    callback: (params: any) => any
}


export type ICheckInMethod = 'air' | 'manual'

export interface ILedgerEntry {
    id: number
    date: string
    time: string
    staff: IStaff
    student: IStudent
    method: ICheckInMethod
    topic?: ITopic
}

export interface IAppointment {
    id: number
    memo: string
    staff: IStaff
    date: string
    block_schedule: IBlockSchedule
    student: IStudent
}

export interface ITopic {
    id: number
    topic: string
    color: string
    deleted: boolean
    staff: IStaff
}

export interface IScheduled extends IStaff {
    topic?: ITopic
}

export interface ICalendarItemData {
    appointments?: IAppointment[]
    ledgerEntries?: ILedgerEntry[]
    scheduled?: IScheduled[]
    topics?: ITopic[]
}
