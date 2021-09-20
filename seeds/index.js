
const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers")

mongoose.connect("mongodb://localhost:27017/yelp-camp2", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //your user id
            author: "613ca6049a257e32f4671a12",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dxvj5qvb2/image/upload/v1631895090/YelpCamp/agmjz9svakaa0jicwhaw.jpg',
                    filename: 'YelpCamp/agmjz9svakaa0jicwhaw'
                },
                {
                    url: 'https://res.cloudinary.com/dxvj5qvb2/image/upload/v1631895093/YelpCamp/iaqgbantcqw5ak7jynff.jpg',
                    filename: 'YelpCamp/iaqgbantcqw5ak7jynff'
                },
                {
                    url: 'https://res.cloudinary.com/dxvj5qvb2/image/upload/v1631895092/YelpCamp/s1srzvpsrkjijn0ga0kz.jpg',
                    filename: 'YelpCamp/s1srzvpsrkjijn0ga0kz'
                }
            ],
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. ",
            price: price
        })
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close()
})

