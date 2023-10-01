const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
require('dotenv').config();

// Подключение к базе данных PostgreSQL
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const address = process.env.DB_ADDRESS;
const port = process.env.DB_PORT;
const database = process.env.DB_DATABASE;
const sequelize = new Sequelize(`postgres://${user}:${pass}@${address}:${port}/${database}`);


// Определение модели таблицы
const literacyResult = sequelize.define('literacyResult', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	timestamp: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	result: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

// Создание таблицы, если она не существует
sequelize.sync();

// Middleware для парсинга JSON
app.use(bodyParser.json());


app.use(cors());

// Обработчик POST-запросов
app.post('/api/v1/finishTest', async (req, res) => {
	try {
		const { result } = req.body;

		if (result === undefined || result === null) {
			return res.status(400).json({ message: 'Поле "result" обязательно' });
		}

		// Создание записи в таблице с указанным значением result
		const createdRecord = await literacyResult.create({
			timestamp: new Date(),
			result: result,
		});

		res.status(201).json(createdRecord);
	} catch (error) {
		console.error('Ошибка при создании записи:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

// Запуск сервера
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
	console.log(`Сервер запущен на порту ${PORT}`);
});


