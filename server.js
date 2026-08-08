import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..'); 

const PORT = 3000;
const app = express();

app.use(express.json());// middleware to parse JSON through the body of req
app.use(express.static(path.join(ROOT, 'public')));

app.get("/", (req,res)=>{
    res.sendFile(path.join(ROOT, 'public', 'index.html'));
});

app.listen(PORT, ()=>{
    console.log(`Server Listening on ${PORT}` );
})


