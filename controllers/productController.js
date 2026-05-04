require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const os = require('os');
// --- KHAI BÁO CÁC ROUTES ---
const uiRoutes = require('../routes/uiRoutes');
const productRoutes = require('../routes/productRoutes');
const dataSource = require('./services/dataSource');
const path = require('path');
const fs = require('fs'); 

// --- BẮT ĐẦU: Cấu hình Prometheus Custom Metrics ---
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});
// --- KẾT THÚC: Cấu hình Prometheus ---

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware ghi nhận Metrics
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ route: req.route ? req.route.path : req.path, code: res.statusCode, method: req.method });
  });
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint xuất Metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// --- QUAN TRỌNG: Middleware truyền biến hostname và source toàn cục ---
// Phải đặt TRƯỚC các app.use('/', uiRoutes)
app.use((req, res, next) => {
  res.locals.hostname = os.hostname();
  res.locals.source = dataSource.isMongo ? 'mongodb' : 'in-memory';
  next();
});

// --- CÁC ROUTE SỬ DỤNG GIAO DIỆN ---
app.use('/', uiRoutes);
app.use('/products', productRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  const uploadsDir = path.join(__dirname, 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Created uploads directory at ${uploadsDir}`);
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://final_devops_group19_mongodb:27017/products_db';
  let usingMongo = false;
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000
    });
    usingMongo = true;
    console.log('Connected to MongoDB — using mongodb as data source.');
  } catch {
    usingMongo = false;
    console.log('Failed to connect to MongoDB within 3s — falling back to in-memory database.');
  }

  await dataSource.init(usingMongo);

  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT} — hostname: ${os.hostname()}`);
    console.log(`Data source in use: ${dataSource.isMongo ? 'mongodb' : 'in-memory'}`);
  });
}

start();

module.exports = app;