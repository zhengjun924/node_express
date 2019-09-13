const mysql = require('./service');
const axios = require('axios');

(async function fetch() {
    const { data: { subjects } } = await axios.get('https://api.douban.com/v2/movie/coming_soon?apikey=0df993c66c0c636e29ecbb5344252a4a&city&start=0&count=100')

    subjects.map(item => {
        axios.get(`https://api.douban.com/v2/movie/subject/${item.id}?apikey=0df993c66c0c636e29ecbb5344252a4a`)
            .then(res => {
                const { data } = res;
                let sql = `UPDATE  movie_list  SET summary='${data.summary}' WHERE mid='${data.id}'`;
                mysql.query(sql, (err, result, fileds) => {
                    if (!err) return
                })
            })
            .catch(error => {
                console.log(error);
            });

        let movie_list = `INSERT INTO movie_list (mid,title,genres,poster,summary,alt,mainland_pubdate) SELECT '${item.id}','${item.title}','${item.genres.join(',')}','${item.images.small}','${item.summary}','${item.alt}','${item.mainland_pubdate}' FROM DUAL WHERE NOT EXISTS (SELECT mid FROM movie_list WHERE title='${item.title}')`

        mysql.query(movie_list, (err, result, fileds) => {
            if (!err) return
        });

        let casts = [];
        item.casts.map(cast => {
            casts.push(cast.name)
            let movie_casts = `UPDATE movie_list SET casts='${casts.join(',')}' WHERE title='${item.title}'`;
            mysql.query(movie_casts, (err, result, fileds) => {
                if (!err) return
            })
        });

    });
})()