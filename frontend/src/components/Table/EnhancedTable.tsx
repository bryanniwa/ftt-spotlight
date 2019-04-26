import * as React from 'react'
import * as classNames from 'classnames'

import { Link } from 'react-router-dom'

import {
	Checkbox,
	Icon,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	TextField,
	Tooltip
} from '@material-ui/core'

import { EnhancedTableHead } from './EnhancedTableHead'
import { EnhancedTableToolbar } from './EnhancedTableToolbar'
import { ITableFilter, ITableHeaderColumn } from '../../types/table';

const desc = (a: any, b: any, orderBy: any) => {
	if (b[orderBy] < a[orderBy]) {
		return -1
	}
	if (b[orderBy] > a[orderBy]) {
		return 1
	}
	return 0
}

const stableSort = (array: any[], cmp: any) => {
	const stabilizedThis: any[] = array.map((item, index) => [item, index])
	stabilizedThis.sort((a: any, b: any) => {
		const order = cmp(a[0], b[0])
		if (order !== 0) {
			return order
		}
		return a[1] - b[1]
	})
	return stabilizedThis.map(item => item[0])
}

const getSorting = (order: 'desc' | 'asc', orderBy: any) => {
	return order === 'desc' ? (
		(a: any, b: any) => desc(a, b, orderBy)
	) : (
		(a: any, b: any) => -desc(a, b, orderBy)
	)
}

interface IProps {
	searchable?: boolean
	columns: ITableHeaderColumn[]
	data: any[]
}

interface IState {
	tableQuery: string
	order: 'asc' | 'desc'
	orderBy: string // e.g 'calories'
	selected: number[] // indexes
	data: any[]
	page: number
	rowsPerPage: number
	filters: ITableFilter[]
	filterOpen: boolean
}

export class EnhancedTable extends React.Component<IProps, IState> {
	state: IState = {
		tableQuery: '',
		order: 'asc',
		orderBy: this.props.columns[0].id,
		selected: [],
		data: this.props.data,
		page: 0,
		rowsPerPage: 5,
		filters: [],
		filterOpen: false
	}

	handleFilterOpen = () => {
		this.setState({ filterOpen: true })
	}

	handleFilterClose = () => {
		this.setState({ filterOpen: false })
	}

	handleFilterChange = (filters: ITableFilter[]) => {
		this.setState({ filters }, () => {
			console.log('Filters', this.state.filters)
		})
	}

	filterTableData = (): any[] => {
		const { tableQuery, filters } = this.state
		const properties: string[] = this.props.columns.reduce((acc: string[], column: ITableHeaderColumn) => {
			if (column.searchable) {
				acc.push(column.id);
			}
			return acc
		}, [])
		return this.state.data.filter((row: any) => {
			const matchSearch: boolean = tableQuery.length ? (
				properties.some((property) => {
					return new RegExp(tableQuery.toLowerCase(), 'g').test(row[property].toLowerCase())
				})
			) : true

			const matchFilters = filters.length ? (
				filters.some((filter: ITableFilter) => {
					switch (filter.rule) {
						case 'contains':
							// return row[filter.id].contains(filter.value)
							return false
						case 'ends-with':
							return row[filter.id].endsWith(filter.value)
						case 'equal-to':
							return row[filter.id] == filter.value
						case 'greater-than':
							return row[filter.id] > filter.value
						case 'less-than':
							return row[filter.id] < filter.value
						case 'not-equal-to':
							return row[filter.id] != filter.value
						case 'starts-with':
							return row[filter.id].startsWith(filter.value)
					}
				})
			) : true
			console.log('matchSearch: ', matchSearch, 'matchFilters: ', matchFilters)
			return matchSearch && matchFilters
		})
	}

	handleRequestSort = (property: any) => {
		let order: 'asc' | 'desc' = 'desc'

		if (this.state.orderBy === property && this.state.order === 'desc') {
			order = 'asc'
		}

		this.setState({ order, orderBy: property })
	}

	handleSelectAllClick = (event: any) => {
		if (event.target.checked) {
			console.log('event.target.checked == true')
			let data: any[]
			if (this.state.filters.length || this.state.tableQuery.length) {
				data = this.state.data.map(n => n.id)
			} else {
				data = this.filterTableData().map(n => n.id)
			}
			console.log('data:', data)
			this.setState({ selected: data.map(n => n.id) })
			return
		}
		this.setState({ selected: [] })
	}

	handleClick = (event: any, id: number) => {
		const { selected } = this.state
		const selectedIndex = selected.indexOf(id)
		let newSelected: any[] = []

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id)
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			)
		}

		this.setState({ selected: newSelected })
	}

	handleChangePage = (event: any, page: number) => {
		this.setState({ page })
	}

	handleChangeRowsPerPage = (event: any) => {
		this.setState({ rowsPerPage: event.target.value })
	}

	isSelected = (id: number): boolean => {
		return this.state.selected.indexOf(id) !== -1
	}

	handleTableQueryChange = (value: string) => {
		this.setState({ tableQuery: value })
	}

	render() {
		console.log(this.state.selected)
		const { order, orderBy, selected, rowsPerPage, page } = this.state
		const data = (this.props.searchable && this.state.tableQuery.length) || this.state.filters.length ? (
			this.filterTableData()
		) : (
			this.state.data
		)
		const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

		return (
			<div className='enhanced-table'>
				<Paper>
					<EnhancedTableToolbar
						title='Staff'
						searchable={this.props.searchable}
						tableQuery={this.state.tableQuery}
						numSelected={selected.length}
						numShown={data.length}
						numTotal={this.props.data.length}
						columns={this.props.columns}
						filters={this.state.filters}
						handleFilterOpen={this.handleFilterOpen}
						handleFilterClose={this.handleFilterClose}
						handleFilterChange={this.handleFilterChange}
						handleTableQueryChange={this.handleTableQueryChange}
						filterOpen={this.state.filterOpen}	
					/>
					<div>
						<Table>
							<EnhancedTableHead
								numSelected={selected.length}
								order={order}
								orderBy={orderBy}
								onSelectAllClick={this.handleSelectAllClick}
								onRequestSort={this.handleRequestSort}
								rowCount={data.length}
								columns={this.props.columns}
							/>
							<TableBody>
								{stableSort(data, getSorting(order, orderBy))
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map(n => {
										const isSelected = this.isSelected(n.id)
										const columns = this.props.columns.filter((column: ITableHeaderColumn) => {
											return column.visible
										})
										return (
											<TableRow
												hover
												onClick={(event: any) => this.handleClick(event, n.id)}
												role='checkbox'
												aria-checked={isSelected}
												tabIndex={-1}
												key={n.id}
												selected={isSelected}
											>
												<TableCell padding='checkbox'>
													<Checkbox checked={isSelected} />
												</TableCell>
												{columns.map((column: ITableHeaderColumn) => {
													if (column.link) {
														return (
															<TableCell padding='checkbox'>
																<Tooltip title={column.label} placement='left'>
																	<Link to={`${column.link}/${n[column.id]}`}>
																		<Icon>launch</Icon>
																	</Link>
																</Tooltip>
															</TableCell>
														)
													} else if (column.th) {
														return (
															<TableCell component='th' scope='row' padding='none'>
																{n[column.id]}
															</TableCell>
														)
													} else {
														return <TableCell align='right'>{n[column.id]}</TableCell>
													}
												})}
											</TableRow>
										)
									})
								}
								{emptyRows > 0 && (
									<TableRow style={{ height: 49 * emptyRows }}>
										<TableCell colSpan={4} />
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component='div'
						count={data.length}
						rowsPerPage={rowsPerPage}
						page={page}
						backIconButtonProps={{
							'aria-label': 'Previous Page'
						}}
						nextIconButtonProps={{
							'aria-label': 'Next Page'
						}}
						onChangePage={this.handleChangePage}
						onChangeRowsPerPage={this.handleChangeRowsPerPage}
					/>
				</Paper>
			</div>
		)
	}
}
