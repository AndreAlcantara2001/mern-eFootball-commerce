import Listing from "../models/listing.model.js"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const test = (req, res) => {
    res.json({
        message: 'Hello World',
    })
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'Unauthorized'))

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true })

        const { password, ...restInfo } = updatedUser._doc

        res.status(200).json(restInfo)
    } catch (err) {
        next(err)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'Unauthorized'))
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json({ message: 'User has been deleted...' })
    } catch (err) {
        next(err)
    }
}
export const getUserListings = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'Unauthorized'))
    try {
        const listings = await Listing.find({ userRef: req.params.id })
        res.status(200).json(listings)
    } catch (err) {
        next(err)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const owner = await User.findById(req.params.id)

        if(!owner) return next(errorHandler(404, 'User not found!'))

        const {password: pass, ...restInfo } = owner._doc

        res.status(200).json(restInfo)
    } catch (err) {
        next(err)        
    }
}