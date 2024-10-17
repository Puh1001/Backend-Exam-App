const asyncHandler = require("express-async-handler");
const db = require("../configs/db")

const createSubjects = asyncHandler(async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const {subjectName} = req.body;
        if (!subjectName) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }
        await subjectsService.createSubjects(connection, subjectName);
        return res.status(201).json({
            success: true,
            message: "New subject created successfully"
        });
    } catch (error) {
        connection.rollback();
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    } finally {
        connection.release();
    }
});