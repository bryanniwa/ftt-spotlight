import * as React from 'react'

interface IProps {
	variant: string
	children: any
}
export const EmptyStateIcon = (props: IProps) => {
	const imageName = `url('src/assets/images/empty-state/${props.variant}.svg')`
	return (
		<div className='empty-state-icon'>
			<div className='empty-state-icon__image' style={{background: imageName}}></div>
			{props.children}
		</div>
	)
}