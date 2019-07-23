const express = require('express');
const reqwest = require('reqwest');
const createError = require('http-errors');

const router = express.Router();

/* 豆瓣电影 */

router.get('/movies/comingSoon', (req, res) => {
    const { start = '0', count = '0' } = req.body;
    reqwest({
        url: 'https://api.douban.com/v2/movie/coming_soon?apikey=0df993c66c0c636e29ecbb5344252a4a',
        method: 'get',
        error: err => {
            createError(err);
        },
        data: {
            'start': start,
            'count': count,
        },
        success: function (data) {
            res.json(data);
        }
    })
});

router.get('/movies/inTheaters', (req, res) => {
    reqwest({
        url: 'https://api.douban.com/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a',
        method: 'get',
        error: err => {
            createError(err);
        },
        success: function (data) {
            res.json(data);
        }
    })
});

router.get('/movies/top250', (req, res) => {
    reqwest({
        url: 'https://api.douban.com/v2/movie/top250?apikey=0df993c66c0c636e29ecbb5344252a4a',
        method: 'get',
        error: err => {
            createError(err);
        },
        success: function (data) {
            res.json(data);
        }
    })
});

/* 音乐新歌榜 */
router.get('/music/new', (req, res) => {
    reqwest({
        url: 'http://m.kugou.com',
        method: 'get',
        data: {
            'json': true
        },
        success: data => {
            res.json(data)
        }
    });
});

/* 音乐排行榜 */
router.get('/music/rank', (req, res) => {
    reqwest({
        url: 'http://m.kugou.com/rank/list',
        method: 'post',
        data: {
            'json': true
        },
        success: data => {
            res.json(data)
        }
    });
});

/* 排行版分类歌曲列表 */
router.get('/music/top500', (req, res) => {
    reqwest({
        url: 'http://m.kugou.com/rank/info',
        method: 'post',
        data: {
            'rankid': 8888,
            'page': 1,
            'json': true,
        },
        success: data => {
            res.json(data);
        }
    })
});

/* 音乐歌单 */
router.get('/music/plist', (req, res) => {
    reqwest({
        url: 'http://m.kugou.com/plist/index',
        method: 'post',
        data: {
            'json': true
        },
        success: data => {
            res.json(data);
        }
    })
});

/* 歌单下的音乐列表 */
router.get('/music/plist/list', (req, res) => {
    reqwest({
        url: 'http://m.kugou.com/plist/list',
        method: 'post',
        data: {
            'specialid': 125032,
            'json': true,
        },
        success: data => {
            res.json(data);
        }
    })
});

/* 歌手分类 */
router.get('/music/singer', (req, res) => {
    reqwest({
        url: 'http://m.kugou.com/singer/class',
        method: 'post',
        data: {
            'json': true,
        },
        success: data => {
            res.json(data);
        }
    })
});

/* 歌手分类下面的歌手列表 */
router.get('/music/singer/list', (req, res) => {
    reqwest({
        url: 'http://m.kugou.com/singer/list',
        method: 'post',
        data: {
            'json': true,
            'classid': 88
        },
        success: data => {
            res.json(data);
        }
    })
});

/* 歌手信息 */
router.get('/music/singer/info', (req, res) => {
    reqwest({
        url: 'http://m.kugou.com/singer/info',
        method: 'post',
        data: {
            'singerid': 3060,
            'json': true,
        },
        success: data => {
            res.json(data);
        }
    })
});

/* 歌曲音乐详情 */
router.get('/music/songInfo', (req, res) => {
    reqwest({
        url: 'http://m.kugou.com/singer/info',
        method: 'post',
        data: {
            'hash': 'CB7EE97F4CC11C4EA7A1FA4B516A5D97',
            'cmd': 'playInfo',
        },
        success: data => {
            res.json(data);
        }
    })
});

/* 热门搜索列表 */
router.get('/music/hotSearch', (req, res) => {
    reqwest({
        url: 'http://mobilecdn.kugou.com/api/v3/search/hot',
        method: 'post',
        data: {
            'format': true,
            'plat': 0,
            'count': 30,
        },
        success: data => {
            res.json(data)
        }
    })
});

/* 音乐搜索 */
router.get('/music/search', (req, res) => {
    reqwest({
        url: 'http://mobilecdn.kugou.com/api/v3/search/song',
        method: 'post',
        data: {
            'format': true,
            'keyword': '%E7%8E%8B%E5%8A%9B%E5%AE%8F',
            'page': 1,
            'pagesize': 30,
            'showtype': 1
        },
        success: data => {
            res.json(data)
        }
    })
});

/* 头条新闻 */
router.get('/news/header', (req, res, next) => {
    reqwest({
        url: 'http://c.3g.163.com/nc/article/list/T1467284926140/0-20.html',
        method: 'get',
        data: {},
        success: data => {
            res.json(data);
        }
    });
});


module.exports = router;