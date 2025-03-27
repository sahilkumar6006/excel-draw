import express from 'express'
import router from './routes';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

app.listen(3002, () => {
  console.log('Server running on port 3002');
});