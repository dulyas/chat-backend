import { Schema, model } from "mongoose";
import { User } from "./user-model";

export interface Token {
	user: User;
	refreshToken: string;
}

export interface UserToken {
	email: string;
	_id: string;
	isActivated: boolean;
	iat: number;
	exp: number;
}

const TokenSchema = new Schema<Token>({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	refreshToken: {
		type: String,
		required: true,
	},
});

export default model<Token>("Token", TokenSchema);
