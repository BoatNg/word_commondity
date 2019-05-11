import gulp from 'gulp'
import gulpif from 'gulp-if'
import { log, colors } from 'gulp-util'
import named from 'vinyl-named'
import webpack from 'webpack'
import gulpWebpack from 'webpack-stream'
import plumber from 'gulp-plumber'
import livereload from 'gulp-livereload'
import args from './lib/args'

const path = require('path')
const ENV = args.production ? 'production' : 'development'

gulp.task('scripts', (cb) => {
  let REMOTE_HOST = 'https://www.boatng.com'
  if (ENV === 'development') {
    REMOTE_HOST = 'http://127.0.0.1:7001'
  }
  return gulp.src('app/scripts/*.js')
    .pipe(plumber({
      // Webpack will log the errors
      errorHandler() { }
    }))
    .pipe(named())
    .pipe(gulpWebpack({
      devtool: args.sourcemaps ? 'inline-source-map' : false,
      watch: args.watch,
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(ENV),
          'process.env.VENDOR': JSON.stringify(args.vendor),
          'REMOTE_HOST': JSON.stringify(REMOTE_HOST)
        }),
        // new webpack.ProvidePlugin({
        //   "$": "jquery",
        //   "jQuery": "jquery",
        //   "window.jQuery": "jquery"
        // }),
      ].concat(args.production ? [
        new webpack.optimize.UglifyJsPlugin()
      ] : []),
      module: {
        rules: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
          },
          {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
              transformToRequire: {
                image: 'xlink:href'
              }
            }
          },
          // {
          //   test: /\.(css)$/,
          //   use: ["style-loader", "css-loader"]
          // },
          { test: /\.css$/, loader: "style!css" },
          {
            test: /\.(jpe?g|png|gif|svg)$/i, loader: "file-loader", options: {
              name: '../images/[name].[ext]'
            }
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
              {
                loader: 'file-loader',
              }
            ]
          },
        ]
      },
      resolve: {
        alias: {
          helpers: path.resolve(__dirname, 'app/scripts/helpers/'),
          mixins: path.resolve(__dirname, 'app/scripts/mixins/'),
          // bind version of jquery-ui
          // "jquery-ui": "jquery-ui/jquery-ui.js",
          // bind to modules;
          modules: path.resolve(__dirname, "node_modules"),
        },
        extensions: ['.js', '.json', '.vue']
      },
      // externals: {
      //   jquery: 'jQuery'
      // }
    },
      webpack,
      (err, stats) => {
        if (err) return
        log(`Finished '${colors.cyan('scripts')}'`, stats.toString({
          chunks: false,
          colors: true,
          cached: false,
          children: false
        }))
      }))
    .pipe(gulp.dest(`dist/${args.vendor}/scripts`))
    .pipe(gulpif(args.watch, livereload()))
})
