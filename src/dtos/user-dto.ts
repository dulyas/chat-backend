

export default class UserDto {
    email;
    id;
    isActivated;

    constructor(model: {
        email: string,
        _id: string,
        isActivated: boolean
    }) {
        this.email = model.email
        this.id = model._id
        this.isActivated = model.isActivated
    }
}