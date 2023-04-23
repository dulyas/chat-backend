

export default class UserDto {
    email
    id
    isActivated
    avatarUrl
    name

    constructor(model: {
        email: string,
        _id: string,
        isActivated: boolean,
        avatarUrl: string
        name: string
    }) {
        this.email = model.email
        this.id = model._id
        this.isActivated = model.isActivated
        this.avatarUrl = model.avatarUrl
        this.name = model.name
    }
}