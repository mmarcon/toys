/*global require: true*/

var CONFIG = {
    src: 'src'
};

var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        config: CONFIG,
        watch: {
            livereload: {
                files: [
                    '<%= config.src %>/*.html',
                    '{.tmp,<%= config.src %>}/css/{,*/}*.css',
                    '{.tmp,<%= config.src %>}/js/{,*/}*.js',
                    '<%= config.src %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['livereload']
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, CONFIG.src)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('server', ['livereload-start', 'connect:livereload', 'open', 'watch']);
};