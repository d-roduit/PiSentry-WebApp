const development = {
    backendApiUrl: 'http://192.168.1.211:7070',
    mediaServerUrl: 'http://192.168.1.211:6060',
};

const production = {
    backendApiUrl: 'http://api.pisentry.app',
    mediaServerUrl: 'http://mediaserver.pisentry.app',
};

const config = process.env.NODE_ENV === 'production' ? production : development;

export default config;
