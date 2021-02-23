interface IConfig {
  mongoose: {
    hostName: string;
    portNumber: string;
    databaseName: string;
  };

  environment: string;
  sessionSecret: string;
}

export const config: IConfig = {
  mongoose: {
    hostName: "",
    portNumber: "",
    databaseName: "",
  },
  environment: "",
  sessionSecret: "",
};

export { IConfig };
