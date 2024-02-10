const development = {
    backendApiUrl: 'https://192.168.1.211:7043',
    mediaServerUrl: 'https://192.168.1.211:6043',
    get streamingApiEndpoint() { return `${this.backendApiUrl}/v1/streaming`; },
    get thumbnailsApiEndpoint() { return `${this.backendApiUrl}/v1/thumbnails`; },
    get camerasApiEndpoint() { return `${this.backendApiUrl}/v1/cameras`; },
    get recordingsApiEndpoint() { return `${this.backendApiUrl}/v1/recordings`; },
    get notificationsApiEndpoint() { return `${this.backendApiUrl}/v1/notifications`; },
    get detectableObjectsApiEndpoint() { return `${this.backendApiUrl}/v1/detectable-objects`; },
    get detectionActionsApiEndpoint() { return `${this.backendApiUrl}/v1/detection-actions`; },
    get detectableObjectsActionsApiEndpoint() { return `${this.backendApiUrl}/v1/detectable-objects-actions`; },
    get pisentryLivestreamEndpoint() { return `${this.mediaServerUrl}/pisentry`},
};

const production = {
    backendApiUrl: 'https://api.pisentry.app',
    mediaServerUrl: 'https://mediaserver.pisentry.app',
    get streamingApiEndpoint() { return `${this.backendApiUrl}/v1/streaming`; },
    get thumbnailsApiEndpoint() { return `${this.backendApiUrl}/v1/thumbnails`; },
    get camerasApiEndpoint() { return `${this.backendApiUrl}/v1/cameras`; },
    get recordingsApiEndpoint() { return `${this.backendApiUrl}/v1/recordings`; },
    get notificationsApiEndpoint() { return `${this.backendApiUrl}/v1/notifications`; },
    get detectableObjectsApiEndpoint() { return `${this.backendApiUrl}/v1/detectable-objects`; },
    get detectionActionsApiEndpoint() { return `${this.backendApiUrl}/v1/detection-actions`; },
    get detectableObjectsActionsApiEndpoint() { return `${this.backendApiUrl}/v1/detectable-objects-actions`; },
    get pisentryLivestreamEndpoint() { return `${this.mediaServerUrl}/pisentry`},
};

const config = process.env.NODE_ENV === 'production' ? production : development;

export default config;
