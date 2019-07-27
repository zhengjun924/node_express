const mysql = require('./services');
const axios = require('axios');

(async function fetch() {
    const { data: { subjects } } = await axios.get('https://api.douban.com/v2/movie/coming_soon?apikey=0df993c66c0c636e29ecbb5344252a4a&city')

    subjects.map(item => {
        let selectSql = `SELECT title FROM movie_list WHERE title='${item.title}'`;
        let sql = `INSERT INTO movie_list (title,poster) VALUES ('${item.title}','${item.images.small}')`;

        mysql.query(selectSql, (err, result, fileds) => {
            if (!err && result.length == 0) {
                mysql.query(sql, (err, result, fileds) => {
                    console.log('插入成功')
                })
            } else {
                result.map(item => {
                    console.log(`电影：${item.title}已存在`);
                })
            }
        })
    })
})()