const mysql = require('./service');
const axios = require('axios');
const reqwest = require('reqwest');

(async function fetch() {
    const {
        data: {
            subjects
        }
    } = await axios.get('https://api.douban.com/v2/movie/coming_soon?apikey=0df993c66c0c636e29ecbb5344252a4a&city')

    subjects.map(item => {

        axios.get(`https://api.douban.com/v2/movie/subject/${item.id}?apikey=0df993c66c0c636e29ecbb5344252a4a`)
            .then(res => {
                const {
                    data
                } = res;
                let sql = `UPDATE  movie_list  SET summary='${data.summary}' WHERE mid='${data.id}'`;
                mysql.query(sql, (err, result, fileds) => {
                    if (!err) return
                })
            })
            .catch(error => {
                console.log(error);
            });

        let movie_list = `INSERT INTO movie_list (mid,title,poster) SELECT '${item.id}','${item.title}','${item.images.small}' FROM DUAL WHERE NOT EXISTS (SELECT mid FROM movie_list WHERE title='${item.title}' AND poster='${item.images.small}')`

        mysql.query(movie_list, (err, result, fileds) => {
            if (!err) return
        });

        item.casts.map(cast => {
            let movie_casts = `INSERT INTO movie_casts (title,cast) VALUES ('${item.title}','${cast.name}')`;

            mysql.query(movie_casts, (err, result, fileds) => {
                if (!err) return
            })
        });

        // item.genres.map(genre=>{
        //     let movie_genres = `INSERT INTO movie_genres (title,genre) VALUES ('${item.title}','${genre}')`;
        //     mysql.query(movie_genres,(err,result,fileds)=>{
        //         if(!err) console.log('类型插入成功');
        //     })
        // });

    });
})()