import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { MockComponents } from 'ng-mocks';

import { CacheSettingsComponent } from './cache-settings/cache-settings.component';
import { DateTimeSettingsComponent } from './date-time-settings/date-time-settings.component';

import { SettingsDialogComponent } from './settings-dialog.component';

describe('SettingsDialogComponent', () => {
  let component: SettingsDialogComponent;
  let fixture: ComponentFixture<SettingsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SettingsDialogComponent,
        ...MockComponents(
          CacheSettingsComponent,
          DateTimeSettingsComponent,
        )
      ],
      imports: [
        MatListModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
