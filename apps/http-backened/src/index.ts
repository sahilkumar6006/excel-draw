import express from 'express'
import router from './routes';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

app.listen(3004, () => {
  console.log('Server running on port 3004');
});