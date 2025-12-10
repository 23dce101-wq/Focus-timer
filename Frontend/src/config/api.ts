export const API_BASE_URL: string = (import.meta.env.VITE_API_URL as string) || '';

if (!API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_URL is not defined. API_BASE_URL is empty.');
}
