const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const Review = require("./models/reviews");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You need to Login");
        return res.redirect("/login");
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("author");
    const { author } = campground;
    if (!author.equals(req.user._id)) {
        req.flash("error", "you do not have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId).populate("author");
    const { author } = review;
    if (!author.equals(req.user._id)) {
        req.flash("error", "you do not have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}