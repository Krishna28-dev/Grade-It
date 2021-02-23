interface IConfig {
  mongoose: {
    hostName: string;
    portNumber: string;
    databaseName: string;
  };

  environment: string;
}

export { IConfig };
