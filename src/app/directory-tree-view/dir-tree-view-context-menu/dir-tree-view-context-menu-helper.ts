import { FocusMonitor } from '@angular/cdk/a11y';
import { MatMenuTrigger } from '@angular/material/menu';
import { createPrependedLogger } from '../../../../src-shared/log/create-prepended-logger';
import { FlatNode } from '../directory-tree-view.model';
import { DirTreeViewContextMenuData } from './dir-tree-view-context-menu-data';

const logger = createPrependedLogger('[Directory Tree View]');

export class DirTreeViewContextMenuHelper {
  public static createData(node: FlatNode): DirTreeViewContextMenuData {
    return {
      name: node.name,
      path: node.path
    };
  }

  // Disable focus on all buttons in order to get rid of the first button being automatically focused when the context menu is opened.
  // See https://stackoverflow.com/a/51419613/7947548
  public static disableFocus(focusMonitor: FocusMonitor): void {
    const buttons = Array.from(document.getElementsByClassName('context-menu-button'));
    buttons.forEach((button: HTMLElement) => focusMonitor.stopMonitoring(button));
    if (buttons.length === 0) {
      logger.warn(`Context Menu: No buttons are found to configure disabling focus.`);
    }
  }

  // Close the context menu when the overlay receives right click.
  // See https://github.com/angular/components/issues/5007#issuecomment-362944793
  public static configureClosingWithRightClick(contextMenu: MatMenuTrigger): void {
    document.getElementsByClassName('cdk-overlay-backdrop')[0].addEventListener('contextmenu', (offEvent: MouseEvent) => {
      offEvent.preventDefault();
      contextMenu.closeMenu();
    });
  }
}
