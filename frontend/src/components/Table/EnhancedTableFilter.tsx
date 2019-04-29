import * as React from 'react'

import {
	Button,
	Icon,
	IconButton,
	Grow,
	MenuItem,
	Paper,
	Select,
	TextField,
	Tooltip
} from '@material-ui/core'

import {
	ITableFilter,
	ITableHeaderColumn,
	ITableNumericFilterType,
	ITableStringFilterType,
	ITableStringFilter,
	ITableNumericFilter,
} from '../../types/table';

interface StringFilterRule {
	label: string,
	value: ITableStringFilterType
}

interface NumericFilterRule {
	label: string,
	value: ITableNumericFilterType
}

const stringFilterRules: StringFilterRule[] = [
	{ label: 'Equal to', value: 'equal-to' },
	{ label: 'Not equal to', value: 'not-equal-to' },
	{ label: 'Starts with', value: 'starts-with' },
	{ label: 'Ends with', value: 'ends-with' }, 
	{ label: 'Contains', value: 'contains' }
]

const numericFilterRules: NumericFilterRule[] = [
	{ label: 'Less than', value: 'less-than' },
	{ label: 'Greater than', value: 'greater-than' },
	{ label: 'Equal to', value: 'equal-to' },
	{ label: 'Not equal to', value: 'not-equal-to' }
]

interface IProps {
	filters: ITableFilter[]
	columns: ITableHeaderColumn[]
	open: boolean
	handleFilterChange: (filters: ITableFilter[]) => void
	handleFilterClose: () => void
}

interface IState {
	filters: ITableFilter[]
}

/**
 * @TODO MSeparate the handleFilterChange into 3 methods.
 */
export class EnhancedTableFilter extends React.Component<IProps, IState> {
	state: IState = {
		filters: this.props.filters.length ? this.props.filters : [this.newFilter()]
	}

	private newFilter(): ITableFilter {
		let filter: ITableFilter
		if (this.props.filters.length) {
			filter = {
				...this.props.filters[this.props.filters.length - 1],
				value: ''
			}
		} else {
			if (this.props.columns[0].isNumeric) {
				filter = {
					id: this.props.columns[0].id,
					type: 'numeric',
					rule: numericFilterRules[0].value,
					value: ''
				}
			} else {
				filter = {
					id: this.props.columns[0].id,
					type: 'string',
					rule: stringFilterRules[0].value,
					value: ''
				}
			}
		}
		return filter
	}

	onUpdateFilters = () => {
		this.props.handleFilterChange(this.state.filters)
		this.handleClose()
	}

	onAddFilter = () => {
		this.setState((state: IState) => {
			return {filters: state.filters.concat(this.newFilter()) }
		})
	}

	onRemoveFilter = (index: number) => {
		this.setState((state: IState) => {
			return { 
				filters: state.filters.filter((filter, idx) => {
					return index !== idx
				})
			}
		})
	}

	onRemoveAllFilters = () => {
		this.setState({ filters: [] })
	}

	handleChangeFilterID = (value: any, index: number) => {
		this.setState((state: IState) => {
			const filters: ITableFilter[] = state.filters.map((filter: ITableFilter, idx: number) => {
					if (idx !== index) {
						return filter
					} else {
						const column = this.props.columns.find((column: ITableHeaderColumn) => {
							return column.id === value
						})
						const hasTypeChanged: boolean = filter.type === 'string' ? column.isNumeric : !column.isNumeric
						let newFilter: ITableNumericFilter | ITableStringFilter
						newFilter = {
							id: value,
							value: hasTypeChanged ? '' : filter.value,
							type: 'string',
							rule: hasTypeChanged ? stringFilterRules[0].value : filter.rule
						}
						if (hasTypeChanged && column.isNumeric) {
							newFilter =  {
								id: value,
								value: hasTypeChanged ? '' : filter.value,
								type: 'numeric',
								rule: hasTypeChanged ? numericFilterRules[0].value : filter.rule
							}
						} 
						return newFilter
					}
				})
				return { filters }
			}
		)
	}

	handleChangeFilterRule = (value: any, index: number) => {
		this.setState((state: IState) => {
			return {
				filters: state.filters.map((filter, idx) => {
					return index !== idx ? filter : { ...filter, rule: value }
				})
			}
		})
	}

	handleChangeFilterValue = (value: string, index: number) => {
		this.setState((state: IState) => {
			return {
				filters: state.filters.map((filter, idx) => {
					return index !== idx ? filter : { ...filter, value }
				})
			}
		})
	}

	handleClose = () => {
		this.props.handleFilterClose()
	}

	/**
	 * @TODO Add a componnentDidMount and componentDidUnmount and give it
	 * an event listener, so users can close the window. Also allow enter key
	 * to create a new filter, and Ctrl + Enter to apply.
	 */
	render() {
		return (
			<Grow in={this.props.open} >
				<Paper className='enhanced-table__filters' elevation={6}>
					<div className='filters-header'>
						<h3>Filters</h3>
						<ul className='filter-actions'>
							<li className='filter-action'>
								<Tooltip placement='bottom' title='Remove All'>
									<IconButton onClick={() => this.onRemoveAllFilters()}>
										<Icon>delete</Icon>
									</IconButton>
								</Tooltip>
							</li>
							<li className='filter-action'>
								<Tooltip placement='bottom' title='Apply Filters'>
									<IconButton onClick={() => this.onUpdateFilters()}>
										<Icon>check</Icon>
									</IconButton>
								</Tooltip>
							</li>
							<li className='filter-action'>
								<Tooltip placement='bottom' title='Cancel'>
									<IconButton onClick={() => this.handleClose()}>
										<Icon>close</Icon>
									</IconButton>
								</Tooltip>
							</li>
						</ul>
					</div>
					{this.state.filters.length ? (
						<ul>
							{this.state.filters.map((filter: ITableFilter, idx: number) => {
								const filterRules: Array<StringFilterRule | NumericFilterRule> = filter.type === 'string' ? (
									stringFilterRules
								) : (
									numericFilterRules
								)

								return (
									<li key={idx} className='filter-rule'>
										<Select
											name='id'
											margin='dense'
											value={filter.id}
											onChange={(event: any) => {this.handleChangeFilterID(event.target.value, idx)}}
										>
											{this.props.columns.map((column: ITableHeaderColumn) => {
												return (
													<MenuItem value={column.id}>
														{column.label}
													</MenuItem>
												)
											})}
										</Select>
										<Select
											name='rule'
											margin='dense'
											value={filter.rule}
											onChange={(event: any) => this.handleChangeFilterRule(event.target.value, idx)}
										>	
											{filterRules.map((filterRule) => (
												<MenuItem value={filterRule.value}>
													{filterRule.label}
												</MenuItem>
											))}
										</Select>
										<TextField
											variant='standard'
											margin='dense'
											onChange={(event: any) => this.handleChangeFilterValue(event.target.value, idx)}
											value={filter.value}
										/>
										<IconButton onClick={() => this.onRemoveFilter(idx)}><Icon>close</Icon></IconButton>
									</li>
								)
							})}
						</ul>
					) : (
						<p className='placeholder'>No filters added.</p>
					)}
					<Button variant='contained' color='primary' onClick={() => this.onAddFilter()}>Add Filter</Button>
				</Paper>
			</Grow>
		)
	}

}