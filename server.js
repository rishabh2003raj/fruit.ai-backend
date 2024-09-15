const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

app.use(express.json()); 
mongoose.connect('mongodb://127.0.0.1:27017/Faqdb')

const faqSchema = new mongoose.Schema({
    question: String,
    answer: String,
});

const Faq = mongoose.model('Faq', faqSchema);

app.post('/faqs', async (req, res) => {
    try {
        const newFaq = new Faq(req.body);
        const savedFaq = await newFaq.save();
        res.status(201).json(savedFaq);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/faqs', async (req, res) => {
    try {
        const faqs = await Faq.find();
        res.json(faqs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/faqs/:id', async (req, res) => {
    try {
        const faq = await Faq.findById(req.params.id);
        if (!faq) return res.status(404).json({ message: 'FAQ not found' });
        res.json(faq);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/faqs/:id', async (req, res) => {
    try {
        const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFaq) return res.status(404).json({ message: 'FAQ not found' });
        res.json(updatedFaq);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/faqs/:id', async (req, res) => {
    try {
        const deletedFaq = await Faq.findByIdAndDelete(req.params.id);
        if (!deletedFaq) return res.status(404).json({ message: 'FAQ not found' });
        res.json({ message: 'FAQ deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});