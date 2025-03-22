import mongoose from 'mongoose'

const UserModel = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: String,
    password: String
}));

export { UserModel }