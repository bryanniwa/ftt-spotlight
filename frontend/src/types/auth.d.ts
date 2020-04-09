import { TopicColor } from '../theme'

export interface ICredentials {
    username: string
    password: string
}

export interface IAvatar {
    initials: string
    color: TopicColor
}

export interface IUserDetails {
    accountType: 'student' | 'teacher' | 'staff' | 'guardian'
    firstName: string
    lastName: string
    name: string
    avatar: IAvatar
}

export interface IStudent extends IUserDetails {
    accountType: 'student'
    grade: number
}

export interface IStaff extends IUserDetails {
    accountType: 'staff'
    administrator: boolean
}

export interface ITeacher extends Omit<IStaff, 'accountType'> {
    accountType: 'teacher'
    title: string
}

export interface IGuardian extends IUserDetails {
    accountType: 'guardian'
}

export type IUser = IStudent | IStaff | ITeacher | IGuardian
