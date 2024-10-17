const createSubject = async (conection, subject) => {
    const [result] = await conection.query("INSERT INTO subjects (subject_name) VALUES (?)", [subject]);
    return result.insertId;
}

module.exports = {
    createSubject
}