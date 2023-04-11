const Vote = require("../models/vote.model");
const Candidate = require("../models/candidate.model");

module.exports.toggleLike = async function(req, res){
    try{
        let voteable;

        voteable = await Candidate.findById(req.query.id).populate('vote');

        let existingVote = await Vote.findOne({
            voteable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        if(!existingVote){
            let newVote = await Vote.create({
                user: req.user._id,
                voteable: req.query.id,
                onModel: req.query.type
            });

            voteable.likes.push(newVote._id);
            voteable.save();
        }

        return res.status(200).json({
            message: "Request successful",
            data: {
            }
        })

    }catch(err){
        console.log(err);
        return res.json(500, {
            message: 'Internal server error'
        });
    }
}