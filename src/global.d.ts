// 元の text/babel 構成を踏襲したバンドル内シムが利用する window 拡張。
// loose 導入フェーズのため any 受けとし、段階的に型を付ける足場とする。
export {};

declare global {
  interface Window {
    firebaseModules: any;
    auth: any;
    db: any;
    appId: string;
    __firebase_config: string;
    __app_id: string;
  }
}
