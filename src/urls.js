const development = {
    backendApiUrl: 'http://192.168.1.211:7070',
    mediaServerUrl: 'http://192.168.1.211:6060',
    get streamingApiEndpoint() { return `${this.backendApiUrl}/v1/streaming`; },
    get thumbnailsApiEndpoint() { return `${this.backendApiUrl}/v1/thumbnails`; },
    get camerasApiEndpoint() { return `${this.backendApiUrl}/v1/cameras`; },
    get recordingsApiEndpoint() { return `${this.backendApiUrl}/v1/recordings`; },
    get notificationsApiEndpoint() { return `${this.backendApiUrl}/v1/notifications`; },
    get pisentryLivestreamEndpoint() { return `${this.mediaServerUrl}/pisentry`},
};

const production = {
    backendApiUrl: 'http://api.pisentry.app',
    mediaServerUrl: 'http://mediaserver.pisentry.app',
    get streamingApiEndpoint() { return `${this.backendApiUrl}/v1/streaming`; },
    get thumbnailsApiEndpoint() { return `${this.backendApiUrl}/v1/thumbnails`; },
    get camerasApiEndpoint() { return `${this.backendApiUrl}/v1/cameras`; },
    get recordingsApiEndpoint() { return `${this.backendApiUrl}/v1/recordings`; },
    get notificationsApiEndpoint() { return `${this.backendApiUrl}/v1/notifications`; },
    get pisentryLivestreamEndpoint() { return `${this.mediaServerUrl}/pisentry`},
};

const config = process.env.NODE_ENV === 'production' ? production : development;

export default config;
