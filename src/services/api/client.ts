export type ApiClient = { get<T>(path: string): Promise<T>; post<T>(path: string, body: unknown): Promise<T> };
export const createApiClient = (baseUrl: string): ApiClient => ({
 async get<T>(_path) { return Promise.resolve({} as T); },
 async post<T>(_path, _body) { return Promise.resolve({} as T); }
});
