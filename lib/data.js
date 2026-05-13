//dependenies
const fs = require('fs');
const path = require('path');

const lib = {};

// base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// write data to a file
lib.create = (dir, file, data, callback) => {
    // open the file for writing
    fs.open(`${lib.baseDir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // write to file and close it
            fs.writeFile(fileDescriptor, stringData, err => {
                if (!err) {
                    fs.close(fileDescriptor, err => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('error closing new file');
                        }
                    });
                } else {
                    callback('error writing to new file');
                }
            });

        }
        else {
            callback('could not create new file, it may already exist');
            return;
        }
    });
};

// read data from a file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.baseDir + dir}/${file}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    });
};

//Update data inside a file
lib.update = (dir, file, data, callback) => {
    // open the file for writing
    fs.open(`${lib.baseDir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);
            // truncate (empty) the file
            fs.ftruncate(fileDescriptor, err => {
                if (!err) {
                    // write the new data to the file
                    fs.writeFile(fileDescriptor, stringData, err => {
                        if (!err) {
                            // close the file
                            fs.close(fileDescriptor, err => {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('error closing file');
                                }
                            });
                        } else {
                            callback('error writing to file');
                        }
                    });
                } else {
                    callback('error truncating file');
                }
            });
        } else {
            callback('could not open file for updating');
        }
    });
};

// delete existing file
lib.delete = (dir, file, callback) => {
    // unlink the file
    fs.unlink(`${lib.baseDir + dir}/${file}.json`, err => {
        if (!err) {
            callback(false);
        } else {
            callback('error deleting file');
        }
    });
};

module.exports = lib;