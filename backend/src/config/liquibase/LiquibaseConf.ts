const liquibase = require("liquibase");

let updateDatabase: Promise<void> = liquibase({
    defaultsFile: './src/config/liquibase/liquibase.properties'
})
.run('update');

export default updateDatabase;
