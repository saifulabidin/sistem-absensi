import { Timestamp } from 'firebase/firestore'

export type Account = {
	id: string
	email: string
	password: string
	display_name: string
	default_break_time: number
	created_at: Timestamp
	updated_at?: Timestamp
	deleted_at?: Timestamp
}
