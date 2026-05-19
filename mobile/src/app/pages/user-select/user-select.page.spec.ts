import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserSelectPage } from './user-select.page';

describe('UserSelectPage', () => {
  let component: UserSelectPage;
  let fixture: ComponentFixture<UserSelectPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
