import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { RiEdit2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import Card from '../../components/common/card/Card'
import CardHeader from '../../components/common/card/CardHeader'
import Divider from '../../components/common/Divider'
import Dividers from '../../components/common/Dividers'
import { UsersFirestore } from '../../firebase/firestore/UsersFirestore'
import * as AccountTypes from '../../types/AccountTypes'

const UsersIndex = () => {
	const [users, setUsers] = useState<QueryDocumentSnapshot<DocumentData>[]>([])
	useEffect(() => {
		console.log(`log ::: page: UsersIndex`)
		UsersFirestore.getUsers().then((response) => setUsers(response?.docs!))
	}, [])
	return (
		<Dividers className={`relative h-100p mt-minus-30 ml-minus-30`}>
			<Divider className={`max-h-[calc(100%+30px)] pt-30 pl-30`} base={8}>
				<Card className={`overflow-y-scroll max-h-100p`}>
					<CardHeader priority={'primary'} displayText={'Users'} />
					{users.length && (
						<table className={`w-100p mt-20`}>
							<tbody>
								{users.map((user, index) => (
									<tr key={index}>
										<td className={`py-4`}>{user.data().display_name}</td>
										<td className={`py-4`}>{user.data().email}</td>
										<td className={`py-4 w-1 whitespace-nowrap`}>
											<div className={`text-white flex justify-center items-center`}>
												<Link to={`/users/${user.data().id}`} className={`p-8 rounded-8 hover:bg-theme hover:shadow-theme duration-300 cursor-pointer`}>
													<RiEdit2Line size={18} />
												</Link>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</Card>
			</Divider>
			<Divider className={`pt-30 pl-30`} base={4}>
				<Card>
					<CardHeader priority={'primary'} displayText={'Filtering'} />
				</Card>
			</Divider>
		</Dividers>
	)
}

export default UsersIndex
