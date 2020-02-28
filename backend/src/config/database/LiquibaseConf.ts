const liquibase = require("liquibase");

let runLiquibase: Promise<void> = liquibase({
    defaultsFile: './src/config/database/liquibase.properties'
})
.run('update');

export default runLiquibase;
