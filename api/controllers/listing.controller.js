import mongoose from "mongoose";
import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing)
    } catch (err) {
        next(err)
    }
}
export const deleteListing = async (req, res, next) => {

    const listingToDel = await Listing.findById(req.params.id)

    if (!listingToDel) {
        return next(errorHandler(404, 'Listing not found!'))
    }

    if (req.user.id !== listingToDel.userRef) {
        return next(errorHandler(401, 'You can only delete your own listing'))
    }

    try {
        await Listing.findByIdAndDelete(req.params.id)
        return res.status(200).json(`Listing ${req.params.id} is deleted.`)
    } catch (err) {
        next(err)
    }
}

export const updateListing = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(errorHandler(400, 'Invalid listing ID'));
    }
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'You can only update your own listings!'));
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
};