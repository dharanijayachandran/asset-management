import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetInputOutputComponent } from './asset-input-output.component';

describe('AssetInputOutputComponent', () => {
  let component: AssetInputOutputComponent;
  let fixture: ComponentFixture<AssetInputOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetInputOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetInputOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
