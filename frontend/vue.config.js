// vue.config.js
module.exports = {
    pages: {
        index: {
            entry: 'src/main.ts',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'WaS 2020'
        },
        login: {
            entry: 'src/login/main.ts',
            template: 'public/login.html',
            filename: 'login.html',
            title: 'WaS 2020 Login'
        }
    },
    
    outputDir: '../dist',
    assetsDir: 'assets',
    indexPath: 'index.html',
    filenameHashing: true,
    lintOnSave: false,
    runtimeCompiler: true,
    parallel: 4
}