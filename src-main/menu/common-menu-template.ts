import { dialog, MenuItemConstructorOptions } from 'electron';

export const commonMenuTemplate: MenuItemConstructorOptions[] = [
  {
    label: 'Selection',
    submenu: [
      {
        label: 'Undo',
        click(item, focusedWindow) {
          const options = {
            type: 'info',
            buttons: ['OK'],
            title: 'Undo Menu Clicked',
            message: 'Undo menu is clicked!',
            detail: 'This will be replaced with undo selection of item(s) in treeview.'
          };
          dialog.showMessageBox(focusedWindow, options);
        }
      },
      {
        label: 'Redo',
        click(item, focusedWindow) {
          const options = {
            type: 'info',
            buttons: ['OK'],
            title: 'Redo Menu Clicked',
            message: 'Redo menu is clicked!',
            detail: 'This will be replaced with redo selection of item(s) in treeview.'
          };
          dialog.showMessageBox(focusedWindow, options);
        }
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        },
      },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }
];
