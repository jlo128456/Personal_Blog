require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files from the 'public' directory

app.get('/api/search', async (req, res) => {
    const query = req.query.q || 'html, javascript, css, react, programming, coding';
    const apiUrl = `http://api.serpstack.com/search?access_key=${process.env.SERPSTACK_API_KEY}&query=${query}&engine=google&type=web&device=desktop&location=new york&google_domain=google.com&gl=us&hl=en&page=1&num=25&output=json`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});