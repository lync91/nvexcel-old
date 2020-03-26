import React, { Component } from "react";
import { Dropdown, IDropdownOption, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton } from 'office-ui-fabric-react';
import { Separator } from 'office-ui-fabric-react/lib/Separator';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
// import { Label } from 'office-ui-fabric-react/lib/Label';
import { connect } from "react-redux";
import { CHANGE_PAGE_SIZE, CHANGE_ORIENTATION, TOGGLE_AUTO_INIT_PRINT_AREA } from "../constants/actions";
// import * as conV from "./vietuni";

export interface AppProps {
	dispatch: any;
	pageSize: string;
	orientation: string;
	autoInit: boolean;
	blackAndWhite: boolean;
}

const dropdownStyles: Partial<IDropdownStyles> = {
	dropdown: { width: 300 }
};

const options: IDropdownOption[] = [
	{ key: "a4", text: "A4" },
	{ key: "a3", text: "A3" },
];
const optKieuin: IDropdownOption[] = [
	{ key: "portrait", text: "Dọc" },
	{ key: "landscape", text: "Ngang" },
];

export class PageFormat extends Component<AppProps> {
	constructor(props, context) {
		super(props, context);
	}
	componentWillMount() {
	}
	_formatPage = async () => {
		try {
			await Excel.run(async context => {
				/**
				 * Insert your Excel code here
				 */
				const ws = context.workbook.worksheets.getActiveWorksheet();
				ws.pageLayout.paperSize = Excel.PaperType[this.props.pageSize];
				ws.pageLayout.orientation = Excel.PageOrientation[this.props.orientation]
				const range = context.workbook.getSelectedRange();
				const rangeA = ws.getRange('A:ZZ');
				const rangeB = ws.getRange('A4:ZZ4');
				const lastRow = rangeA.find("*", {
					completeMatch: true, // find will match the whole cell value
					matchCase: false, // find will not match case
					searchDirection: Excel.SearchDirection.backwards // find will start searching at the beginning of the range
				})
				const lastCol = rangeB.findOrNullObject("*", {
					completeMatch: true, // find will match the whole cell value
					matchCase: false, // find will not match case
					searchDirection: Excel.SearchDirection.backwards // find will start searching at the beginning of the range
				})
				lastRow.load("address");
				lastCol.load("address");
				await context.sync();
				console.log('lastRow', lastRow.address);
				console.log('lastCol', lastCol.address);
				
				const printArea = range.address.slice(range.address.indexOf('!') + 1, range.address.length);
				ws.pageLayout.setPrintArea(printArea);
				if (this.props.orientation === "portrait") {
					ws.pageLayout.topMargin = 40;
					ws.pageLayout.bottomMargin = 40;
					ws.pageLayout.leftMargin = 50;
					ws.pageLayout.rightMargin = 20;
				}
				if (this.props.orientation === "landscape") {
					ws.pageLayout.topMargin = 50;
					ws.pageLayout.bottomMargin = 40;
					ws.pageLayout.leftMargin = 40;
					ws.pageLayout.rightMargin = 40;
				}
				ws.pageLayout.zoom = { horizontalFitToPages: 1 };
				ws.pageLayout.centerHorizontally = true;
				ws.pageLayout.centerVertically = false;
				ws.pageLayout.blackAndWhite = this.props.blackAndWhite;
				ws.pageLayout.blackAndWhite = this.props.blackAndWhite;
			});
		} catch (error) {
			console.error(error);
		}

	}
	_changePageSize = (option: IDropdownOption, _index?: number) => {
		this.props.dispatch({ type: CHANGE_PAGE_SIZE, pageSize: option.key })
	}
	_changOrientation = (option: IDropdownOption, _index?: number) => {
		this.props.dispatch({ type: CHANGE_ORIENTATION, orientation: option.key })
	}
	_isAutoInitChanged = (_ev: React.MouseEvent<HTMLElement>, checked: boolean) => {
		this.props.dispatch({ type: TOGGLE_AUTO_INIT_PRINT_AREA, autoInit: checked})
	}
	render() {
		// const { title, logo, message } = this.props;
		return (
			<section className="ms-Grid">
						<Separator>Định dạng trạng in tự động</Separator>
				<div className="ms-Grid-row">
					<div className="ms-Grid-col ms-sm12 ms-lg12">
						<Dropdown placeholder="Chọn cỡ giấy" label="Cỡ giấy" defaultSelectedKey={this.props.pageSize} options={options} styles={dropdownStyles} onChanged={this._changePageSize} />
						<Dropdown placeholder="Chọn kiểu in" label="Kiểu in" defaultSelectedKey={this.props.orientation} options={optKieuin} styles={dropdownStyles} onChanged={this._changOrientation} />
						<Toggle className="mt-8" defaultChecked={ this.props.autoInit } onText="Tự động nhận dạng vùng in" offText="Tự động nhận dạng vùng in" onChange={this._isAutoInitChanged} />
						<Toggle className="mt-8" defaultChecked={ this.props.blackAndWhite } onText="In đen trắng" offText="In đen trắng" onChange={this._isAutoInitChanged} />
					</div>
				</div>
				<div className="ms-Grid-row">
					<div className="ms-Grid-col ms-sm12 mt-8">
						<Stack horizontal>
							<PrimaryButton text="Định dạng" onClick={this._formatPage} allowDisabledFocus />
						</Stack>
					</div>
				</div>
				<Separator>Định dạng trạng in G8</Separator>
				<div className="ms-Grid-row">
					<div>
					<Toggle label="Tự động nhận dạng vùng in" defaultChecked={ this.props.autoInit } onText="Bật" offText="Tắt" onChange={this._isAutoInitChanged} />
					</div>
					<div>
						<Stack>
						</Stack>
					</div>
				</div>
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		pageSize: state.pageFormat.pageSize,
		orientation: state.pageFormat.orientation,
		autoInit: state.pageFormat.autoInit,
		blackAndWhite: state.pageFormat.blackAndWhite
	}
}
export default connect(mapStateToProps)(PageFormat)