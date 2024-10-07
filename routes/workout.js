const express = require("express");
const workoutController = require("../controllers/workout")

const { verify, verifyAdmin } = require("../auth")

const router = express.Router();

router.post("/addWorkout", verify, workoutController.addWorkout);

router.get("/getMyWorkouts", verify, workoutController.getWorkout);

router.patch("/updateWorkout/:_id", verify, workoutController.updateWorkout);

router.delete("/deleteWorkout/:_id", verify, workoutController.deleteWorkout);

router.patch("/completeWorkoutStatus/:_id", verify, workoutController.completeWorkout);

module.exports = router;