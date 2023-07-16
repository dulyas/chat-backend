export default class UserDto {
	email: string;

	isActivated: boolean;
	avatarUrl: string;
	name: string;
	_id: string;

	constructor(model: {
		email: string;
		_id: string;
		isActivated: boolean;
		avatarUrl: string;
		name: string;
	}) {
		this.email = model.email;

		this._id = model._id;
		this.isActivated = model.isActivated;
		this.avatarUrl = model.avatarUrl;
		this.name = model.name;
	}
}
