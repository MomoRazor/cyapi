import { Connection, Model, ObjectId, Schema } from 'mongoose'
import { User } from './UserRepo'

export type Rooms = 'Hall' | 'Meeting Room 1' | 'Meeting Room 2'

export interface Event {
    name: string
    rooms: Rooms[]
    start: Date
    end: Date
    bookingUserId: ObjectId
}

export interface ResolvedEvent extends Event {
    bookingUser: Partial<User>
}

const { String, ObjectId, Date } = Schema.Types

export type IEventRepo = Model<Event>

const eventSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        rooms: {
            type: [String],
            required: true,
            enum: ['Hall', 'Meeting Room 1', 'Meeting Room 2'],
        },
        start: {
            type: Date,
            required: true,
        },
        end: {
            type: Date,
            required: true,
        },
        bookingUserId: {
            type: ObjectId,
            required: true,
        },
    },
    { timestamps: true }
)

export const EventRepo = async (
    connection: Connection
): Promise<IEventRepo> => {
    const eventRepo = connection.model<Event>('event', eventSchema)
    await eventRepo.syncIndexes()
    return eventRepo
}
