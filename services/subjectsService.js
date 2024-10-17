const subjectsModel = require('../models/subjectsModel');

const createSubject = (conection, subjectName) => {
    const subjectId = subjectsModel.createSubject(conection, subjectName);
    return subjectId;
}

module.exports = {
    createSubject
};