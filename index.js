const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
const { MongoClient } = require('mongodb');
var app = express()


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const url = "mongodb+srv://ghdalsrud210:WqaLX8CCjiSHHtqF@cluster0.hlmhed7.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(url);

let collection;
const dbConnect = async () => {
	await client.connect();
	const db = client.db('test_project'); // 생성한 Database 이름
	console.log("접속 성공")
	collection = db.collection('count_collection')
}

app.get('/api', async function (req, res) {
	const result = await collection.find().toArray();
	res.send(result)
})
// 저장 
app.post('/api/insert', async function (req, res) {
	// 저장 - inserOne
	await collection.insertOne(req.body);
	const result = await collection.find().toArray();
	res.send(result)
})

// 삭제 
// /api/delete?date=12321423
app.delete('/api/delete', async function (req, res) {
	// 삭제 - deleteOne
	const {date} = req.query; // id를 date로 받아서 그 date로 인식
	await collection.deleteOne({date:Number(date)});
	const result = await collection.find().toArray();
	res.send(result)
})

// 수정 
// /api/update?date=12321423
app.put('/api/update', async function (req, res) {
	// 수정 - updateOne
	const {date} = req.query; // id를 date로 받아서 그 date로 인식
	const {count} = req.body; // id를 date로 받아서 그 date로 인식
	await collection.updateOne({date:Number(date)}, {$set:{count:count}});
	const result = await collection.find().toArray();
	res.send(result)
})

app.listen(3000, dbConnect) 
// 콜백함수 자리에 dbConnect를 넣어 dbConnect 실행 후 get이 실행되도록