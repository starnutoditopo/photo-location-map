import { Component} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { ElectronService } from '../shared/service/electron.service';
import { DirectoryTreeViewDataService } from '../directory-tree-view/directory-tree-view-data.service';

import { SidebarComponent } from './sidebar.component';

@Component({ selector: 'app-directory-tree-view', template: '' })
class DummyDirectoryTreeViewComponent {}

class DummyMatDialog {}

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidebarComponent,
        DummyDirectoryTreeViewComponent
      ],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        ElectronService,
        DirectoryTreeViewDataService,
        { provide: MatDialog, useClass: DummyMatDialog }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render "Select Folder" button', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#select-folder-button>button').textContent).toEqual('SIDEBAR.SELECT_FOLDER');
  }));
});
