import * as React from "react";
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
	autoInit: boolean
}

const dropdownStyles: Partial<IDropdownStyles> = {
	dropdown: { width: 300 }
};

const options: IDropdownOption[] = [
	{ key: "A4", text: "A4" },
	{ key: "A3", text: "A3" },
];
const optKieuin: IDropdownOption[] = [
	{ key: "portrait", text: "Dọc" },
	{ key: "landscape", text: "Ngang" },
];

export class PageFormat extends React.Component<AppProps> {
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
				const range = context.workbook.getSelectedRange();
				const firstCol = range.getLastColumn();
				firstCol.load("address")
				// Read the range address
				range.load("addressLocal");
				range.load("values");

				await context.sync();
				console.log(firstCol.address);
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
					<div className="ms-Grid-col ms-sm6 ms-md8 ms-lg10">
						<Dropdown placeholder="Chọn cỡ giấy" label="Cỡ giấy" defaultSelectedKey={this.props.pageSize} options={options} styles={dropdownStyles} onChanged={this._changePageSize} />
						<Dropdown placeholder="Chọn kiểu in" label="Kiểu in" defaultSelectedKey={this.props.orientation} options={optKieuin} styles={dropdownStyles} onChanged={this._changOrientation} />
						<Toggle label="Tự động nhận dạng vùng in" defaultChecked={ this.props.autoInit } onText="Bật" offText="Tắt" onChange={this._isAutoInitChanged} />
					</div>
				</div>
				<div className="ms-Grid-row">
					<div className="ms-Grid-col ms-sm6 ms-md8 ms-lg10 mt-8">
						<Stack horizontal>
							<PrimaryButton text="Định dạng" onClick={this._formatPage} allowDisabledFocus />
						</Stack>
					</div>
				</div>
				<Separator>Định dạng trạng in G8</Separator>
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		pageSize: state.pageFormat.pageSize,
		orientation: state.pageFormat.orientation,
		autoInit: state.pageFormat.autoInit
	}
}
export default connect(mapStateToProps)(PageFormat)