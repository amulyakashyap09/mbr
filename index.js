var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path').resolve('.');

exports.createBackup = function (credentials, options, callback) {

    if ("dbName" in options && "path" in options) {

        exec("pgrep mongod", function (err) {
            if (err) {
                callback({
                    error: 404,
                    message: "Please start mongo server"
                });
            } else {

                var command, fileName;

                if ("fileName" in options) {
                    fileName = options.path + "/" + options.fileName;
                } else {
                    fileName = options.path + "/" + (new Date()).getTime() + ".gz";
                }
                if (!("host" in credentials)) {
                    credentials.host = "127.0.0.1";
                }

                if (!("port" in credentials)) {
                    credentials.port = 27017;
                }

                if (options.dbName == "*") {
                    if ("userName" in credentials && "password" in credentials) {
                        command = "mongodump --host " + credentials.host + " --port " + credentials.port + " --username " + credentials.userName + " --password " + credentials.password + " --archive=" + fileName + " --gzip";
                    } else {
                        command = "mongodump --host " + credentials.host + " --port " + credentials.port + " --archive=" + fileName + " --gzip";
                    }
                } else {
                    if ("userName" in credentials && "password" in credentials) {
                        command = "mongodump --host " + credentials.host + " --port " + credentials.port + " --username " + credentials.userName + " --password " + credentials.password + " --archive=" + fileName + " --gzip --db " + options.dbName;
                    } else {
                        command = "mongodump --host " + credentials.host + " --port " + credentials.port + " --archive=" + fileName + " --gzip --db " + options.dbName;
                    }
                }

                exec(command, function (err) {

                    if (err) {
                        callback({
                            error: 404,
                            message: err
                        });
                    } else {
                        callback(null, {
                            statusCode: 200,
                            message: options.dbName + " dump created successfully!!!"
                        });
                    }
                });
            }
        });

    } else {
        if (!("path" in options)) {
            return callback({
                error: 404,
                message: "Path for dump is required!!!!"
            });
        }

        if (!("dbName" in options)) {
            return callback({
                error: 404,
                message: "Database name for dump is required!!!!"
            });
        }
    }
};

exports.restoreBackup = function (credentials, options, callback) {

    if ("dumpPath" in options) {

        exec("pgrep mongod", function (err) {
            if (err) {
                callback({
                    error: 404,
                    message: "Please start mongo server"
                });
            } else {

                var command;

                var fileName = options.dumpPath.substring(options.dumpPath.lastIndexOf("/") + 1, options.dumpPath.length);

                if (!("host" in credentials)) {
                    credentials.host = "127.0.0.1";
                }

                if (!("port" in credentials)) {
                    credentials.port = 27017;
                }

                if ("userName" in credentials && "password" in credentials) {
                    command = "mongorestore --host " + credentials.host + " --port " + credentials.port + " --username " + credentials.userName + " --password " + credentials.password + " --archive=" + options.dumpPath + " --gzip";
                } else {
                    command = "mongorestore --host " + credentials.host + " --port " + credentials.port + " --archive=" + options.dumpPath + " --gzip";
                }

                exec(command, function (err) {

                    if (err) {
                        callback({
                            error: 404,
                            message: err
                        });
                    } else {

                        if ("deleteDumpAfterRestore" in options && options.deleteDumpAfterRestore == true) {
                            fs.unlinkSync(options.dumpPath);
                        }
                        callback(null, {
                            statusCode: 200,
                            message: fileName + " Restored successfully!!!"
                        });
                    }
                });
            }
        });

    } else {
        return callback({
            error: 404,
            message: "Specify Dump Path for restoration!!!"
        });
    }
};