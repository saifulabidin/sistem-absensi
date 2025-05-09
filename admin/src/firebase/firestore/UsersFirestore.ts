import { getFirebaseDb } from '../Firebase'
import { collection, addDoc, getDocs, setDoc, doc } from 'firebase/firestore'
import * as AccountTypes from '../../types/AccountTypes'

const db = getFirebaseDb()

export class UsersFirestore {
	static async setUser(account: AccountTypes.Account) {
		console.log(account)
		try {
			const docRef = await setDoc(doc(db, 'users', account.id), { ...account })
		} catch (error) {
			console.error(`error ::: ${error}`)
		}
	}
	static async getUsers() {
		try {
			return await getDocs(collection(db, 'users'))
		} catch (error) {
			console.error(`error ::: ${error}`)
		}
	}
	static async updateUser(id: string) {
		try {
			const querySnapshot = await getDocs(collection(db, 'users'))
			querySnapshot.forEach((doc) => {
				console.log(`doc.id: ${doc.id}`)
				console.log(doc.data())
			})
		} catch (error) {
			console.error(`error ::: ${error}`)
		}
	}
}
