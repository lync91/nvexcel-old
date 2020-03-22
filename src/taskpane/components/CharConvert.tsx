import * as React from "react";
import { Dropdown, IDropdownOption, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';

export interface HeaderProps {
	title: string;
	logo: string;
	message: string;
}

const dropdownStyles: Partial<IDropdownStyles> = {
	dropdown: { width: 300 }
};

const options: IDropdownOption[] = [
	{ key: 'apple', text: 'Apple' },
	{ key: 'apple', text: 'Apple' },
];

export default class CharConvert extends React.Component {
	render() {
		// const { title, logo, message } = this.props;
		return (
			<section className="ms-Grid">
				<Dropdown placeholder="Chọn mã đang dùng" label="Mã đang dùng" options={options} styles={dropdownStyles} />
				<Dropdown placeholder="Chọn mã muốn chuyển" label="Mã chuyển sang" options={options} styles={dropdownStyles} />
			</section>
		);
	}
}