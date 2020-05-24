import { IAppointment } from './appointment'
import { IAirCheckIn, ILedgerEntry } from './checkin'
import { IClassroom } from './classroom'
import { IPlan } from './plan'
import { ITopic } from './topic'

export type ICalendar = Record<string, ICalendarEvent[]>

export interface ICalendarEvent {
    label: string
    context: ICalendarEventContext
    startTime?: string
    endTime?: string
}

export interface ICalendarEventContext {
    airCheckIns?: IAirCheckIn[]
    appointments?: IAppointment[]
    attended?: boolean
    ledgerEntries?: ILedgerEntry[]
    location?: IClassroom
    missedAppointment?: boolean
    plans?: IPlan[]
    topic?: ITopic
}

export interface ICalendarContextDetails {
    event: ICalendarEvent
    date: Date
    title: string
    color?: string
}
