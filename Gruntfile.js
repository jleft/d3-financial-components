/* global module */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            componentsJsFiles: [
                'components/**/*.js'
            ],
            testJsFiles: [
                'tests/**/*Spec.js'
            ],
            visualTestJsFiles: [
                'visual-tests/src/**/*.js'
            ],
            componentsCssFiles: [
                'components/**/*.css'
            ],
            ourJsFiles: [
                '<%= meta.componentsJsFiles %>',
                '<%= meta.testJsFiles %>',
                '<%= meta.visualTestJsFiles %>',
                '!components/utilities/csslayout.js'
            ]
        },

        assemble: {
            options: {
                assets: 'visual-tests/dist/assets',
                partials: 'visual-tests/src/site/templates/includes/*.hbs',
                layoutdir: 'visual-tests/src/site/templates/layouts'
            },
            visualTests: {
                files : [
                    {
                        expand: true,
                        cwd: 'visual-tests/src/site/pages/',
                        src: ['index.hbs'],
                        dest: 'visual-tests/dist/'
                    },
                    {
                        expand: true,
                        cwd: 'visual-tests/src/test-fixtures/',
                        src: ['**/*.hbs'],
                        dest: 'visual-tests/dist/'
                    }
                ],
                options: {
                    layout: 'test.hbs'
                }
            }
        },

        concat: {
            options: {
                sourceMap: false
            },
            dist: {
                src: ['components/fc.js', 'components/utilities/*.js', '<%= meta.componentsJsFiles %>'],
                dest: 'dist/<%= pkg.name %>.js'
            },
            visualTests: {
                options: {
                    sourceMap: true
                },
                src: 'visual-tests/src/site/assets/js/**/*.js',
                dest: 'visual-tests/dist/assets/index.js',
            }
        },

        copy: {
            visualTests: {
                options: {

                },
                files: [
                    {
                        expand: true,
                        cwd: 'visual-tests/src/site/assets/css',
                        src: ['**/*.css'],
                        dest: 'visual-tests/dist/assets/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/d3/',
                        src: ['d3.js'],
                        dest: 'visual-tests/dist/assets/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/css-layout/src/',
                        src: ['Layout.js'],
                        dest: 'visual-tests/dist/assets/',
                    },
                    {
                        expand: true,
                        cwd: 'dist',
                        src: ['d3-financial-components.js', 'd3-financial-components.css'],
                        dest: 'visual-tests/dist/assets/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap/dist/',
                        src: ['**'],
                        dest: 'visual-tests/dist/assets/bootstrap/',
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/jquery/dist/',
                        src: ['jquery.min.js'],
                        dest: 'visual-tests/dist/assets/',
                    },
                    {
                        expand: true,
                        cwd: 'visual-tests/src/test-fixtures/',
                        src: ['**/*', '!**/*.hbs'],
                        dest: 'visual-tests/dist/',
                    }
                ]
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        concat_css: {
            options: {},
            all: {
                src: ['<%= meta.componentsCssFiles %>'],
                dest: 'dist/<%= pkg.name %>.css'
            }
        },

        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['<%= pkg.name %>.css'],
                    dest: 'dist/',
                    ext: '.min.css'
                }]
            }
        },

        watch: {
            files: [
                '<%= meta.ourJsFiles %>',
                '<%= meta.componentsCssFiles %>'
            ],
            tasks: ['build'],
            options: {
                livereload: true
            }
        },

        jscs: {
            options: {
                config: '.jscsrc'
            },
            failOnError: {
                files: {
                    src: ['<%= meta.ourJsFiles %>']
                }
            },
            warnOnly: {
                options: {
                    force: true
                },
                files: {
                    src: ['<%= meta.ourJsFiles %>']
                }
            }
        },

        jshint: {
            options: {
                jshintrc: true,
                extract: true
            },
            failOnError: {
                files: {
                    src: ['<%= meta.ourJsFiles %>']
                }
            },
            warnOnly: {
                options: {
                    force: true
                },
                files: {
                    src: ['<%= meta.ourJsFiles %>']
                }
            }
        },

        jsdoc : {
            dist : {
                src: ['<%= meta.componentsJsFiles %>'],
                options: {
                    destination: 'doc'
                }
            }
        },

        jasmine: {
            options: {
                specs: '<%= meta.testJsFiles %>',
                vendor: [
                    'node_modules/d3/d3.js',
                    'http://d3js.org/d3.v3.js'
                ]
            },
            test: {
                src: ['<%= meta.componentsJsFiles %>'],
            },
            testDebug: {
                src: ['<%= meta.componentsJsFiles %>'],
                options: {
                    keepRunner: true
                }
            }
        },

        clean: {
            doc: ['doc'],
            visualTests: ['visual-tests/dist']
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('assemble');

    grunt.registerTask('check:failOnError', ['jshint:failOnError', 'jscs:failOnError']);
    grunt.registerTask('check:warnOnly', ['jshint:warnOnly', 'jscs:warnOnly']);
    grunt.registerTask('check', ['check:failOnError']);
    grunt.registerTask('build', ['check', 'concat:dist', 'uglify:dist', 'concat_css:all', 'cssmin:dist', 'jasmine:test']);
    grunt.registerTask('dev', ['build', 'watch']);
    grunt.registerTask('doc', ['clean:doc', 'jsdoc']);
    grunt.registerTask('ci', ['default']);
    grunt.registerTask('test', ['jasmine:test', 'visual-tests']);
    grunt.registerTask('visual-tests', ['build', 'clean:visualTests', 'copy:visualTests', 'concat:visualTests', 'assemble:visualTests']);
    grunt.registerTask('vt', ['visual-tests']);
    grunt.registerTask('default', ['build', 'doc']);
};
