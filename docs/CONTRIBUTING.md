# Contributing to this project

This page contains useful information to contribute to this project.


## CI Status

| OS      | Status                                       |
|:-------:|:--------------------------------------------:|
| Windows | [![ci-on-windows-image]][ci-on-windows-link] |
| macOS   | [![ci-on-macos-image]][ci-on-macos-link]     |
| Ubuntu  | [![ci-on-ubuntu-image]][ci-on-ubuntu-link]   |

[ci-on-windows-image]: https://github.com/TomoyukiAota/photo-location-map/workflows/CI%20on%20Windows/badge.svg
[ci-on-windows-link]: https://github.com/TomoyukiAota/photo-location-map/actions?query=workflow%3A%22CI+on+Windows%22
[ci-on-macos-image]: https://github.com/TomoyukiAota/photo-location-map/workflows/CI%20on%20macOS/badge.svg
[ci-on-macos-link]: https://github.com/TomoyukiAota/photo-location-map/actions?query=workflow%3A%22CI+on+macOS%22
[ci-on-ubuntu-image]: https://github.com/TomoyukiAota/photo-location-map/workflows/CI%20on%20Ubuntu/badge.svg
[ci-on-ubuntu-link]: https://github.com/TomoyukiAota/photo-location-map/actions?query=workflow%3A%22CI+on+Ubuntu%22


## Prerequisite

 - Node.js (64-bit, version 18.13.0 or greater)
 - More than 2GB of RAM
   - Application packaging frequently fails on a PC with 1GB of RAM. Add more RAM depending on the available memory for application packaging on your PC.


## Build and run for development

After cloning this repository, run these commands to start the application: 

``` bash
npm ci
npm start
```


## Frequently Used Commands

|Command|Description|
|--|--|
|`npm start`| Build and run the application for development. |
|`npm run test:all`| Run all tests. Linting, unit tests, and package creation/smoke tests are included. |
|`npm run package:windows`| Create an installer for Windows. |
|`npm run package:mac`| Create a `.dmg` file which contains a `.app` file for macOS. |
|`npm run package:linux`| Create an application for Linux. |


## Using npm modules

### Electron renderer process

npm modules which are 1) used only in Electron renderer process and 2) imported by `import` (not `require`) should be configured in `devDependencies` (not `dependencies`) in `package.json`.

Angular build system creates a bundle file from `.ts` files. The bundle file will have the copy of `import`ed (not `require` d) npm module, and the copy is used at run time. Also, electron-builder will copy npm modules listed in `dependencies` (not `devDependencies`) to create an application package. Therefore, configuring `import`ed (again, not `require`d) npm modules used only in Electron renderer process with `devDependencies` saves the size of application package.



### Electron main process

npm modules used in Electron main process need to be configured in `dependencies` in `package.json`. 


## Sidenote

Development of this application is started by using [maximegris/angular-electron](https://github.com/maximegris/angular-electron). [The contents of the respository as of commit 7618abcea496a26656be11f31542713b728919e9 (on Dec 31, 2018)](https://github.com/maximegris/angular-electron/tree/7618abcea496a26656be11f31542713b728919e9) are used with some modification and removal.

## In-container development with Visual Studio Code and Docker

After cloning this repository, run Visual Studio Code and open this folder in container.


To build, prepend the `npm` command with `sudo`.

>**Example**
>
>Build:
>
>```bash
>sudo npm ci
>```

To create the release binaries, prepend the `npm` command with `sudo`.

>**Example**
>
>Create a Windows executable and installer:
>
>```bash
> sudo npm run package:windows
> ```
>Find the binaries in the `release/win-unpacked` directory and the installer in `release`.