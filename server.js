const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Increase the body size limit
app.use(express.json({ limit: '10mb' }));

app.use(express.static('public'));

app.post('/save-answers', (req, res) => {
    const { userName, answers } = req.body;

    // Sanitize the username to ensure it's safe for use as a file name
    const sanitizedUserName = userName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const dataPath = path.join(__dirname, 'data', `${sanitizedUserName}_user_answers.json`);

    const userAnswers = answers.map(q => ({
        id: q.id,
        userAnswer: q.userAnswer,
        timeSpent: q.timeSpent,
        documentClicks: q.documentClicks
    }));

    // Write the user answers to a JSON file named after the user
    fs.writeFile(dataPath, JSON.stringify(userAnswers, null, 2), (err) => {
        if (err) {
            console.error('Error saving user answers:', err);
            res.status(500).send('Error saving user answers');
        } else {
            res.status(200).send('User answers saved successfully');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
