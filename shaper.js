const program = require('commander');
const fs = require('fs')
const path = require('path');

// copy files and repeat recursively on sub-dirs

let flatten = (base, dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            files.forEach(f => {
                let isDir = fs.statSync(path.join(dir, f)).isDirectory()

                if (isDir) {

                    //recur

                    flatten(base, f, processed);

                } else {

                    // copy to base

                    let name = path.join(dir, f).replace(/\//, '-')

                    console.log(`Copying file ${path.join(dir, f)}`)

                    fs.rename(path.join(dir, f), path.join(base, name), (err) => {
                        if (err) reject(err)

                        resolve();
                    })

                }
            })
        })

    })
}


program
    .command('flatten')
    .description('flatten a directory structure')
    .action(() => {

        let base = path.resolve('./')

        // gather dirs - ignore files on top-level

        let dirs = fs.readdirSync(base).
            filter(f => fs.statSync(path.join(base, f)).isDirectory())

        dirs.forEach(d => {
            flatten(base, d).then(() => {

                // remove empty dir

                fs.rmdirSync(path.join(base, d))

            }).catch(e => {
                console.log(e)
            })
        })

    })

program.parse(process.argv);