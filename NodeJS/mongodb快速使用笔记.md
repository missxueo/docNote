
# mongodb 数据库简介

MongoDB 是一个介于关系数据库和非关系数据库之间的产品。
MongoDB 将数据存储为一个文档，数据结构由键值(key : value)对组成。
MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。

MongoDB 简单概念
sql 概念 | mongodb 概念 | 解释
- | - | - 
database | database | 数据库
table | collection | 数据表/集合
row | document | 记录/文档
column | field | 字段/域
idnex | index | 索引
primary key | primary key | 主键
table joins ||表连接


# mongodb 官方驱动

> npm install mongodb --save

以下为数据库连接部分信息

```js
const url = '127.0.0.1';
const port = 27017;
const dbName = 'store';
const collName = 'books';

```

以mongodb [官方 v3.1 api]("http://mongodb.github.io/node-mongodb-native/3.1/api/") 为例，更详细使用见官方API

```js
const mongodb = require("mongodb");

const server = new mongodb.Server(url,port);
const mgclient = new mongodb.MongoClient(server);
const db = new mongodb.Db(dbName);
const colls = db.collection(collName);

mgclient.connect(function(err,client){
    if(err)
        return;
    console.log('connection opened');
    //todo query by use query api
    //exp: colls.find({})
    colls.find({}).toArray()
        .then(docs=>{
            console.log(docs);
        });

    client.close();
});

```

# mongoose 的简单使用

mongoose 相比 原生mongodb 驱动的使用优势：

* mongoose 能让开发者像操作关系型数据库一样操作数据库；
* 开发者 不需要每次手动关闭连接

> npm install mongoose --save

以 [mongoose v5.2.12 api](https://mongoosejs.com/docs/api.html) doc 为例，更多详见官方API 文档


```js
const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
    name: String,
    page: Number,
    author: String,
});
const books = mongoose.model(collName,bookSchema);
const connect = mongoose.connect(`mongodb://${ip}:${port}/${dbName}`,{
    useNewUrlParser: true,
});

(async()=>{
    await connect;
    console.log('connection opened');
    let bookList = await books.find().exec();
    console.log(bookList);

})();


```

