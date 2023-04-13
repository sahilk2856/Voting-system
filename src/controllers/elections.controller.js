const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const Election = require("../models/election.model");
const { electionType } = require('../utils/constant')


const getElection = async (req, res, next) => {
    try {
        let data = {};
        const viewElection = await Election.find()
        const currentDate = new Date();
        const pastElections = await Election.find({ endDate: { $lt: currentDate } }).sort({ startDate: -1 });
        const upcomingElections = await Election.find({ startDate: { $gt: currentDate } }).sort({ startDate: 1 });

        data.allElection = viewElection;
        data.electionType = electionType 
        data.pastElection = pastElections;
        data.upComingElection = upcomingElections;

        res.status(200).json({ 
            success: true,
            data: data
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { getElection}