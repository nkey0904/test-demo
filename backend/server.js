const express = require('express');
const fs = require('fs'); // Rule check: require('fs')
const path = require('path');
const app = express();

app.get('/api/view-log', (req, res) => {
    // Input từ người dùng (Biến động)
    const userFilename = req.query.filename;

    try {
        // ❌ LỖI BẢO MẬT: Path Traversal
        // Semgrep sẽ bắt dòng này vì biến 'userFilename' được truyền vào fs.readFileSync
        // Pattern match: $MOD.$METHOD($PATH, ...)
        const content = fs.readFileSync(userFilename, 'utf8');
        
        res.send(content);
    } catch (err) {
        res.status(500).send("Error reading file");
    }
});

// Một ví dụ khác với fs.writeFile
app.post('/api/save-note', (req, res) => {
    const notePath = req.body.path;
    const noteContent = req.body.content;

    // ❌ LỖI BẢO MẬT: Path Traversal
    // Semgrep cũng sẽ bắt dòng này (writeFile nằm trong regex danh sách đen)
    fs.writeFile(notePath, noteContent, (err) => {
        if (err) console.error(err);
    });
});

app.listen(3000);