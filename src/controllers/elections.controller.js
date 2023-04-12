const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const Election = require("../models/election.model");

const createElection = async (req, res, next) => {
    const { name, startDate, endDate, candidates,type,area,date } = req.body;
    console.log(">>>>>>>>idhar tak aya",req.body)
    try {
        if (!name || !startDate  || !endDate || !candidates || !type || !area ||!date) {
            throw new Error("All the fields should be valid", {
                cause: { status: 400 }
            })
        }
        const election = await Election.create(req.body)
        console.log(election)
        res.status(200).json({ 
            success: true,
            data: election
        })

    } catch (error) {
        next(error)
    }
}

const getElection = async (req, res, next) => {
    try {
        const viewElection = await Election.find()
        if (!viewElection) {
            throw new Error("Election not happened", {
                cause: { status: 404 }
            })
        }
        res.status(200).json({ 
            success: true,
            data: viewElection
        })
    } catch (error) {
        next(error)
    }
}

const electionType = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name ) {
        throw new Error("All the fields should be valid", {
            cause: { status: 400 }
        })
    }
    const electionType = new ElectionType();
      res.status(200).json({ 
        success: true,
        data: electionType
    })
} catch (error) {
    next(error)
}
}

// const getElectionById = async (req, res, next) => {
//     try {
//         const viewElectionById = await Election.findById(req.params.id)
//         if (!viewElectionById) {
//             throw new Error("Election not exists", {
//                 cause: { status: 404 }
//             })
//         }
//         res.status(200).json({ 
//             success: true,
//             data: viewElectionById
//         })
//     } catch (error) {
//         next(error)
//     }
// }


// const updateElection = async (req, res, next) => {
//     try{
//         const { name, startDate, endDate, candidates } = req.body;
//         if (!name || !startDate  || !endDate || !candidates) {
//             throw new Error("All the fields should be valid", {
//                 cause: { status: 400 }
//             })
//         }
//         const updateElection = await Election.findByIdAndUpdate(req.body, {
//             new: true
//         })
//     res.status(200).json({ 
//         success: true,
//         data: updateElection
//     })
// } catch (error) {
//     next(error)
// }
// }
      
//   const deleteElection('/:id', (req, res) => {
//     Election.findByIdAndDelete(req.params.id)
//       .then(() => res.status(204).end())
//       .catch(err => res.status(500).json({ error: err }));
//   });


// get upcoming elections
const upComingElection =  async (req, res, next) => {
    try {
      const currentDate = new Date();
      const upcomingElections = await Election.find({ startDate: { $gt: currentDate } }).sort({ startDate: 1 });
     // res.json(upcomingElections);
      res.status(200).json({ 
        success: true,
        data: upcomingElections
    })

} catch (error) {
    next(error)
}
}
 
  // get past elections
  const pastElection = async (req, res, next) => {
    try {
      const currentDate = new Date();
      const pastElections = await Election.find({ endDate: { $lt: currentDate } }).sort({ startDate: -1 });
     // res.json(pastElections);
      res.status(200).json({ 
        success: true,
        data: pastElections
    })

} catch (error) {
    next(error)
}
}

module.exports = {createElection, getElection, electionType, pastElection, upComingElection}