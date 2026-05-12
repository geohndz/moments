export {};

declare global {
  interface Window {
    __MOMENTS_FIREBASE__?: {
      apiKey: string;
      authDomain: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
    };
  }
}
