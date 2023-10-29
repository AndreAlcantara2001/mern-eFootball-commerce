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

export const getListing = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(errorHandler(400, 'Invalid listing ID'));
        }
        const listing = await Listing.findById(req.params.id)

        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'))
        }
        res.status(200).json(listing)

    } catch (err) {
        next(err)
    }
}

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if (offer === 'true') {
            offer = true;
        } else if (offer === 'false') {
            offer = false;
        } else {
            offer = { $in: [false, true] }
        }

        let isbigtime = req.query.isbigtime;
        if (isbigtime === undefined || isbigtime === 'false') {
            isbigtime = { $in: [false, true] }
        }

        let islegend = req.query.islegend;
        if (islegend === undefined || islegend === 'false') {
            islegend = { $in: [false, true] }
        }

        let isepic = req.query.isepic;
        if (isepic === undefined || isepic === 'false') {
            isepic = { $in: [false, true] }
        }

        let isshowtime = req.query.isshowtime;
        if (isshowtime === undefined || isshowtime === 'false') {
            isshowtime = { $in: [false, true] }
        }

        let type = req.query.type;
        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'trade'] }
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            isbigtime,
            islegend,
            isepic,
            isshowtime,
            type,
        }).sort(
            { [sort]: order }
        ).limit(limit).skip(startIndex)

        return res.status(200).json(listings)


    } catch (err) {
        next(err)
    }
}