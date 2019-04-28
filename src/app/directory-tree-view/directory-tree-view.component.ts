import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { DirectoryTreeViewDataService } from './directory-tree-view-data.service';
import { FlatNode, NestedNode } from './directory-tree-view.model';

/**
 * @title Directory tree view
 */
@Component({
  selector: 'app-directory-tree-view',
  templateUrl: 'directory-tree-view.component.html',
  styleUrls: ['directory-tree-view.component.scss']
})
export class DirectoryTreeViewComponent {
  public readonly treeControl: FlatTreeControl<FlatNode>;
  public readonly dataSource: MatTreeFlatDataSource<NestedNode, FlatNode>;
  private readonly flatNodeSelectionModel = new SelectionModel<FlatNode>(true /* multiple */);
  private readonly flatToNestedNodeMap = new Map<FlatNode, NestedNode>();
  private readonly nestedToFlatNodeMap = new Map<NestedNode, FlatNode>();
  private readonly treeFlattener: MatTreeFlattener<NestedNode, FlatNode>;
  private readonly getLevel = (flatNode: FlatNode) => flatNode.level;
  private readonly isExpandable = (flatNode: FlatNode) => flatNode.expandable;
  private readonly getChildren = (nestedNode: NestedNode): NestedNode[] => nestedNode.children;

  /**
   * Transform function to convert nested node to flat node. Record the nodes in maps for later use.
   */
  private readonly transform = (nestedNode: NestedNode, level: number) => {
    const existingFlatNode = this.nestedToFlatNodeMap.get(nestedNode);
    const flatNode = existingFlatNode && existingFlatNode.name === nestedNode.name  // TODO: Is `name` property comparison required?
        ? existingFlatNode
        : new FlatNode();
    flatNode.name = nestedNode.name;
    flatNode.isSelectable = nestedNode.isSelectable;
    flatNode.level = level;
    flatNode.expandable = nestedNode.children.length > 0;
    this.flatToNestedNodeMap.set(flatNode, nestedNode);
    this.nestedToFlatNodeMap.set(nestedNode, flatNode);
    return flatNode;
  };

  public readonly hasChild = (_: number, flatNode: FlatNode) => flatNode.expandable;

  constructor(private directoryTreeViewDataService: DirectoryTreeViewDataService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.treeFlattener = new MatTreeFlattener(this.transform, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    directoryTreeViewDataService.dataChange
      .subscribe(data => this.updateDataSourceAndSelectAllNodes(data));
  }

  private updateDataSourceAndSelectAllNodes(data: NestedNode[]) {
    this.dataSource.data = data;
    if (data.length === 0)
      return;

    const rootNestedNode = data[0];
    const rootFlatNode = this.nestedToFlatNodeMap.get(rootNestedNode);
    this.toggleInternalNodeSelection(rootFlatNode);
  }

  public isSelected(flatNode: FlatNode): boolean {
    return this.flatNodeSelectionModel.isSelected(flatNode);
  }

  public allDescendantsSelected(flatNode: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(flatNode);
    const allDescendantsSelected = descendants
      .filter(child => child.isSelectable)
      .every(child => this.isSelected(child));
    return allDescendantsSelected;
  }

  public partOfDescendantsSelected(flatNode: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(flatNode);
    const moreThanOneDescendantsSelected = descendants
      .filter(child => child.isSelectable)
      .some(child => this.isSelected(child));
    return moreThanOneDescendantsSelected && !this.allDescendantsSelected(flatNode);
  }

  public toggleInternalNodeSelection(flatNode: FlatNode): void {
    if (!flatNode.isSelectable)
      return;

    this.flatNodeSelectionModel.toggle(flatNode);
    const descendants = this.treeControl.getDescendants(flatNode);
    this.isSelected(flatNode)
      ? this.flatNodeSelectionModel.select(...descendants)
      : this.flatNodeSelectionModel.deselect(...descendants);
    this.updateAllParents(flatNode);
    this.changeDetectorRef.detectChanges();
  }

  public toggleLeafNodeSelection(flatNode: FlatNode): void {
    if (!flatNode.isSelectable)
      return;

    this.flatNodeSelectionModel.toggle(flatNode);
    this.updateAllParents(flatNode);
    this.changeDetectorRef.detectChanges();
  }

  private updateAllParents(flatNode: FlatNode): void {
    let parent: FlatNode | null = this.getParentNode(flatNode);
    while (parent) {
      this.updateSelectionAccordingToDescendants(parent);
      parent = this.getParentNode(parent);
    }
  }

  private updateSelectionAccordingToDescendants(flatNode: FlatNode): void {
    const isSelected = this.isSelected(flatNode);
    const allDescendantsSelected = this.allDescendantsSelected(flatNode);
    if (isSelected && !allDescendantsSelected) {
      this.flatNodeSelectionModel.deselect(flatNode);
    } else if (!isSelected && allDescendantsSelected) {
      this.flatNodeSelectionModel.select(flatNode);
    }
  }

  private getParentNode(flatNode: FlatNode): FlatNode | null {
    const currentLevel = this.getLevel(flatNode);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(flatNode) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}
