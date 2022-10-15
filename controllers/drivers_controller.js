const Driver = require("../models/driver");

module.exports = {
  greetings(req, res, next) {
    res.send({ hi: "there" });
  },

  //   index(req, res, next) {
  //     const { lng, lat } = req.query;

  //     Driver.find({
  //       "geometry.coordinates": {
  //         $near: {
  //           $maxDistance: 200000,
  //           $geometry: {
  //             type: "Point",
  //             coordinates: [lng, lat],
  //           },
  //         },
  //       },
  //     })
  //       .then((error, drivers) => {
  //         if (error) console.log(error);
  //         res.send(drivers);
  //       })
  //       .catch(next);
  //   },
  index(req, res, next) {
    const { lng, lat } = req.query;
    Driver.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          spherical: true,
          distanceField: "dist.calculated",
          maxDistance: 300000,
        },
      },
    ])
      .then((drivers) => {
        console.log(`my drivers ${drivers}`);
        res.send(drivers);
      })
      .catch((err) => next(err));
  },

  create(req, res, next) {
    console.log(req.body);
    const driverProps = req.body;
    Driver.create(driverProps)
      .then((driver) => res.send(driver))
      .catch((err) => next(err));
  },

  edit(req, res, next) {
    const driverId = req.params.id;
    const driverProps = req.body;

    Driver.findByIdAndUpdate({ _id: driverId }, driverProps)
      .then(() => Driver.findById({ _id: driverId }))
      .then((driver) => res.send(driver))
      .catch((err) => next(err));
  },

  delete(req, res, next) {
    const driverId = req.params.id;

    Driver.findByIdAndRemove({ _id: driverId })
      .then((driver) => res.status(204).send(driver))
      .catch((err) => next(err));
  },
};
