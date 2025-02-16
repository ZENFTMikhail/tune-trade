require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5001;
const SECRET_KEY = process.env.SECRET_KEY;

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Подключено к MongoDB'))
  .catch(err => console.error('Ошибка подключения:', err));

// Схема пользователя
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  username: String
});
const User = mongoose.model('User', userSchema);

// **Регистрация пользователя**
app.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Проверяем, есть ли такой email
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email уже зарегистрирован' });

    // Хешируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, username });

    await newUser.save();

    res.status(201).json({ message: 'Регистрация успешна!' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err });
  }
});

// **Авторизация пользователя**
app.post('/login', async (req, res) => {    
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Неверные учетные данные' });

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Неверный email или пароль' });

    // Создаем JWT-токен
    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Вход выполнен!', token });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err });
  }
});

// **Проверка аутентификации (защищенный маршрут)**
app.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Требуется авторизация' });

    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Неверный токен' });

      const user = await User.findById(decoded.userId).select('-password');
      if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

      res.json(user);
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err });
  }
});

// Запуск сервера
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));

// Проверка работы сервера
app.get('/', (req, res) => {
  res.send('Сервер работает!');
});
