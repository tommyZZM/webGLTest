/**
 * Created by tommyZZM on 2015/8/15.
 */

var post_data = require("../../dist/post_data.json");

var path = require('path');

var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack-stream");

var clean = require("gulp-clean");
var named = require("vinyl-named");
var merge = require("merge-stream");
var concat = require("gulp-concat");
var add = require("gulp-add");
var rename = require("gulp-rename");

var config = global.gulpConfig;

gulp.task("@webpack-demo-entryjs",function(){
    if(Array.isArray(post_data.posts)){

        var loader = "babel-loader";
        if(config.babel && config.babel.polyfill){
            loader+="?experimental&optional=selfContained";
        }

        var tasks = post_data.posts.map(function (demo) {
            return gulp.src(path.join(post_data.base, demo.path, "Entry.js"))
                .pipe(rename("entry.js"))
                .pipe(webpack({
                    output: {
                        libraryTarget: "var",
                        library: "[name]",
                        filename: '[name].js'
                    },
                    devtool: 'inline-source-map',
                    debug: true,
                    externals: config.externals,
                    module: {
                        loaders: [
                            {test: /\.js$/, exclude: /node_modules/, loader: loader},
                            {test: /\.es6~$/, exclude: /node_modules/, loader: loader},
                            {test: /\.less$/, loader: "style!css!less"}
                        ]
                    }
                }, null, function (err, stats) {
                    if (err) throw new gutil.PluginError("webpack", err);
                    //gulp.start(["@webpack-clean-tmp"]);
                }))
                .pipe(gulp.dest(path.join("./dist/post", demo.path, "/js")));
        });

        return merge(tasks);
    }
});

gulp.task("webpack-demo", ["@webpack-demo-entryjs"], function(){

});