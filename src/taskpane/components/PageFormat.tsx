import * as React from "react";
import { Dropdown, IDropdownOption, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton } from 'office-ui-fabric-react';
import { Separator } from 'office-ui-fabric-react/lib/Separator';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { connect } from "react-redux";
import { CHANGE_SRC_KEY, CHANGE_DESC_KEY } from "../constants/actions";
// import * as conV from "./vietuni";

export interface HeaderProps {
	title: string;
	logo: string;
	message: string;
}

export interface AppProps {
	dispatch: any;
	srcKey: string;
	descKey: string;
}

const dropdownStyles: Partial<IDropdownStyles> = {
	dropdown: { width: 300 }
};

const options: IDropdownOption[] = [
	{ key: "A4", text: "A4" },
	{ key: "A3", text: "A3" },
];

export class PageFormat extends React.Component<AppProps> {
	constructor(props, context) {
		super(props, context);
	}
	componentWillMount() {
	}
	_convertTo = async () => {
		try {
			await Excel.run(async context => {
				/**
				 * Insert your Excel code here
				 */
				const range = context.workbook.getSelectedRange();

				// Read the range address
				range.load("address");
				range.load("values");

				await context.sync();
				console.log(`The range address was ${range.address}.`);
				console.log(range.values);
				const newValues = window['convertTo'](JSON.stringify(range.values), this.props.srcKey, this.props.descKey);
				
				range.values = JSON.parse(newValues);
			});
		} catch (error) {
			console.error(error);
		}

	}
	_srcChanged = (option: IDropdownOption, _index?: number) => {
		this.props.dispatch({ type: CHANGE_SRC_KEY, srcKey: option.key })
	}
	_descChanged = (option: IDropdownOption, _index?: number) => {
		this.props.dispatch({ type: CHANGE_DESC_KEY, descKey: option.key })
	}
	render() {
		// const { title, logo, message } = this.props;
		return (
			<section className="ms-Grid">
				<Separator>Định dạng trạng in tự động</Separator>
				<Dropdown placeholder="Chọn mã đang dùng" label="Mã đang dùng" defaultSelectedKey={this.props.srcKey} options={options} styles={dropdownStyles} onChanged={this._srcChanged} />
				<Dropdown placeholder="Chọn mã muốn chuyển" label="Mã chuyển sang" defaultSelectedKey={this.props.descKey} options={options} styles={dropdownStyles} onChanged={this._descChanged} />
				<Separator>Định dạng trạng in tự động</Separator>
				<PrimaryButton text="Chuyển mã" onClick={this._convertTo} allowDisabledFocus />
			</section>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		srcKey: state.charConverter.srcKey,
		descKey: state.charConverter.descKey
	}
}
export default connect(mapStateToProps)(PageFormat)