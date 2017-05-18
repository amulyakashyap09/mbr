#MBR | Mongo Backup Restore
This allows you to backUp and restore data.

**CREATE BACKUP**

`var backup = require("mbr");`

`var credentials={
    host: "127.0.0.1",
    port: 27017,
    userName:'admin',
    password:'mypassword'
};`

`var options = {
    dbName: "myDB",
    path: __dirname,
    fileName: (new Date()).getTime() + '.gz'
};`

`backup.createBackup(credentials, options, function (err, data) {
     console.log(err, data);
 });`

 _**Note**: dbName if set to * backups all databases present_

 **RESTORE BACKUP**

 `var backup = require("mbr");`

 `var credentials={
     host: "127.0.0.1",
     port: 27017,
     userName:'admin',
     password:'mypassword'
 };`

 `var options = {
     dumpPath: "pathToFile/file.gz,
     deleteDumpAfterRestore: true
 };`

 `backup.restoreBackup(credentials, options, function (err, data) {
      console.log(err, data);
  });`

  ##Thanks