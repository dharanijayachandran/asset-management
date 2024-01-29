import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAccessComponent } from './asset-access.component';

describe('AssetAccessComponent', () => {
  let component: AssetAccessComponent;
  let fixture: ComponentFixture<AssetAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
