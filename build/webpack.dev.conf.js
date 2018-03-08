'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const axios = require('axios')

const express = require('express')
const app = express()
const apiRoutes = express.Router()
app.use(apiRoutes)

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{
        from: /.*/,
        to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
      }, ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ?
      {
        warnings: false,
        errors: true
      } :
      false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    before(app) {
      // 获取首屏轮播数据
      app.get('/api/getSlides', function (req, res) {
        const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
        axios.get(url, {
          headers: {
            'origin': 'https://m.y.qq.com',
            'referer': 'https://m.y.qq.com/'
          },
          param: req.query
        }).then(function(response) {
          res.json(response.data)
        })
      })
      // 获取全部推荐歌单数据
      app.get('/api/getPlayList', function(req, res) {        
        let url = 'http://ustbhuangyi.com/music/api/getDiscList?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&categoryId=10000000&rnd=0.2196648602709228'
        axios.get(url).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      // 获取推荐歌单数据
      app.get('/api/getCdinfo', (req, res) => {
        let url = 'http://ustbhuangyi.com/music/api/getCdInfo?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&disstid='+ req.query.disstid +'&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0'
        axios.get(url).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      // 获取排行榜排名
      app.get('/api/getRank', (req, res) => {
        let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1520336592520'
        axios.get(url, {
          headers: {
            origin: 'https://m.y.qq.com',
            referer: 'https://m.y.qq.com'
          },
        }).then((res2) => {
          res.json(res2.data)
        })
      })
      // 获取排行榜榜单详情
      app.get('/api/getTopList', (req, res) => {
        let url =`https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=${req.query.topid}&_=1520341006093`
        axios.get(url, {
          headers: {
            origin: 'https://y.qq.com',
            referer: `https://y.qq.com/w/toplist.html?ADTAG=myqq&from=myqq&channel=10007100&id=${req.query.topid}&type=top`
          }
        }).then((res2) => {
          res.json(res2.data)
        })
      })
      // 搜索查询
      app.get('/api/searchKey', (req, res) => {
        let params = req.query
        let url = `https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&w=${params.w}&zhidaqu=1&catZhida=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&perpage=${params.perPage}&n=${params.perPage}&p=${params.curPage}&remoteplace=txt.mqq.all&_=1520512867671`
        axios.get(url, {
          headers: {
            origin: 'https://m.y.qq.com',
            referer: 'https://m.y.qq.com/'
          }
        }).then((res2) => {
          res.json(res2.data)
        })
      })
      // 热门搜索关键词
      app.get('/api/getHotKey', (req, res) => {
        let url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1520519732352'
        axios.get(url, {
          headers: {
            origin: 'https://m.y.qq.com',
            referer: 'https://m.y.qq.com/'
          }
        }).then((res2) => {
          res.json(res2.data)
        })
      })
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*']
    }])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors ?
          utils.createNotifierCallback() :
          undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
