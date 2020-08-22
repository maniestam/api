//npm i gulp gulp-uglify-es gulp-zip gulp-clean jsonfile gulp-eslint eslint-formatter-friendly
const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const zip = require('gulp-zip');
const clean = require('gulp-clean');
const jsonfile = require('jsonfile');


const pkgPath = './package.json';
const pkg = require(pkgPath);


const releasefolder = '../../release/';
const releasetmpfolder = 'tmp/';
const appfolder = 'LOGIN/';






gulp.task('devbuildcopy', function () {
    updateVersion(pkg.version, 1);
    return gulp.src(['**', '!node_modules/**'])
        .pipe(gulp.dest(releasefolder + releasetmpfolder + appfolder));
});

function updateVersion(version_, env) {
    var version = (version_).split('.');
    var build = Number.parseInt(version[version.length - 1]);
    version[version.length - 1] = (build + 1).toString();
    switch (env) {
        case 1:
            pkg.version = version.join('.');
            console.log('Updated DEV Package Version Number: ' + pkg.version);
            break;
        case 2:
            pkg.qaversion = version.join('.');
            console.log('Updated QA Package Version Number: ' + pkg.qaversion);
            break;
        case 3:
            pkg.uatversion = version.join('.');
            console.log('Updated UAT Package Version Number: ' + pkg.uatversion);
            break;
        case 4:
            pkg.prodversion = version.join('.');
            console.log('Updated PROD Package Version Number: ' + pkg.prodversion);
            break;
    }
    jsonfile.writeFileSync(pkgPath, pkg, {
        spaces: 2
    });
    return pkg.version;
}

gulp.task('buildclean', function () {
    return gulp.src(releasefolder + releasetmpfolder)
        .pipe(clean({
            force: true
        }));
});

gulp.task('devbuild',
    gulp.series('devbuildcopy', 'buildzip', 'buildclean')); // Combine




