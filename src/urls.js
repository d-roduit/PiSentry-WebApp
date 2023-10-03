const development = {
    backendApiUrl: 'http://127.0.0.1:7070',
    mediaServerUrl: 'http://127.0.0.1:6060',
};

const production = {
    backendApiUrl: 'http://api.pisentry.app',
    mediaServerUrl: 'http://mediaserver.pisentry.app',
};

const config = process.env.NODE_ENV === 'production' ? production : development;

export default config;
