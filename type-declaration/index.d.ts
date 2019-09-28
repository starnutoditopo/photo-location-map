declare var window: Window;

interface AboutBoxShowable {
  showAboutBox(): void;
}

interface MapChangeable {
  changeMap(ipcMapChangeArg: string): void;
}

interface IPlmInternalRenderer {
  aboutBox: AboutBoxShowable;
  map: MapChangeable;
}

interface Window {
  process: NodeJS.Process;
  require: NodeRequire;
  plmInternalRenderer: IPlmInternalRenderer;
}

type DirectoryTree = ReturnType<typeof import('directory-tree')>;

declare var google: any;
declare var L: any;

declare var __karma__: any;
declare var __electronMochaMain__: any;
declare var __electronMochaRenderer__: any;
