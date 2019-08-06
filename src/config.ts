interface Config {
  port: number;
  dbConnectionString: string;
  dbName: string;
  accessTokenSecret: string;
  refreshTokenSecret: string;
}

export const config: Config = {
  port: 5000,
  accessTokenSecret: "sovendepigemedbelkadyne",
  refreshTokenSecret: "kortoversovjetunionenfra1976",
  dbConnectionString:
    "mongodb+srv://magnetisk_hest:WQgFpjmBi3fkQ139@stnstrm-db-zdbs7.mongodb.net/test?retryWrites=true&w=majority",
  dbName: "imagemapper"
};
