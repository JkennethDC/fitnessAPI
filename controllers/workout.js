const Workout = require("../models/Workout");

module.exports.addWorkout = async (req, res) => {
    try {

        const userId = req.user._id || req.user.id;  

        if (!userId) {
            return res.status(400).send({ message: 'User ID not found in request.' });
        }

        const existingWorkout = await Workout.findOne({ name: req.body.name });
        if (existingWorkout) {
            return res.status(409).send({ message: 'Workout already exists' });
        }

        const newWorkout = new Workout({
            userId: userId, 
            name: req.body.name,
            duration: req.body.duration
        });

        const result = await newWorkout.save();
        return res.status(201).send(result);
    } catch (error) {
        console.error("Error in creating workout: ", error);
        return res.status(500).send({ error: "Error in creating workout" });
    }
};

module.exports.getWorkout = async (req, res) => {
    try {

        const  userId = req.user._id || req.user.id;  

        if (!userId) {
            return res.status(400).send({ message: 'User ID not found in request.' });
        }

        const myWorkout = await Workout.find({ userId: userId});
        if (myWorkout) {
            return res.status(200).send( {workouts: myWorkout})
        } else {
            return res.status(404).send({message:  "No workouts found for this user."})
        }
    } catch (error) {
        console.error("Error in getting workout: ", error);
        return res.status(500).send({  error: "Error in getting workout" });

    }
}

module.exports.updateWorkout = async (req, res) => {
    try {

        const workout = await Workout.findById(req.params._id);

        if (!workout) {
            return res.status(404).send({ error: 'Workout not found' });
        }

        const userId = req.user._id || req.user.id; 
        if (workout.userId.toString() !== userId) {
            return res.status(403).send({ message: 'You are not authorized to update this workout' });
        }

        if (req.body.name) {
            workout.name = req.body.name;
        }
        if (req.body.duration) {
            workout.duration = req.body.duration;
        }

        const updatedWorkout = await workout.save();

        return res.status(200).send({ message: 'Workout updated successfully', updatedWorkout });

    } catch (error) {
        console.error("Error updating workout: ", error);
        return res.status(500).send({ error: "Error updating workout" });
    }
};


module.exports.deleteWorkout = async (req, res) => {
    try {

        const workout = await Workout.findById(req.params._id);

        if (!workout) {
            return res.status(404).send({ error: 'Workout not found' });
        }

        const userId = req.user._id || req.user.id; 

        if (workout.userId.toString() !== userId) {
            return res.status(403).send({ message: 'You are not authorized to delete this workout' });
        }

        await Workout.findByIdAndDelete(req.params._id);

        return res.status(200).send({ message: 'Workout deleted successfully' });

    } catch (error) {
        console.error("Error deleting workout: ", error);
        return res.status(500).send({ error: "Error deleting workout" });
    }
};

module.exports.completeWorkout = async (req, res) => {
    try {   
        const workout = await Workout.findById(req.params._id);

        if (!workout) {
            return res.status(404).send({ error: 'Workout not found' });
        }

        const userId = req.user._id || req.user.id;

        if (workout.userId.toString() !== userId) {
            return res.status(403).send({ message: 'You are not authorized to update this workout' });
        }

        if (workout.status === 'completed') {
            return res.status(200).send({ message: 'Workout is already completed', completedWorkout: workout });
        }

        workout.status = "completed";
        const completedStatus = await workout.save();

        return res.status(200).send({ message: 'Workout updated successfully', updatedWorkout: completedStatus });

    } catch (error) {
        console.error("Error updating workout: ", error);
        return res.status(500).send({ error: "Error updating workout" });
    }
};