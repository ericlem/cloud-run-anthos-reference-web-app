/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { appNameFactory } from './app.module';
import { of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const firebaseConfig = {
    projectId: 'unit test'
  };

  const onAuthStateChangedSpy = jasmine.createSpy('onAuthStateChanged', (cb: (u: any) => any) => {});

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [
        HttpClientTestingModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        MatToolbarModule,
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        AngularFireModule.initializeApp(firebaseConfig),
        NgxAuthFirebaseUIModule.forRoot(firebaseConfig, appNameFactory,
          {
            authGuardFallbackURL: 'items',
          }),
      ],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: { user: of(null), onAuthStateChanged: onAuthStateChangedSpy },
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display login when user is null', () => {
    expect(component.avatarImageUrl).toBeNull();
    expect(fixture.debugElement.query(By.css('img.avatar'))).toBeNull();
    expect(fixture.debugElement.query(By.css('mat-icon.avatar'))).toBeNull();
    expect(fixture.debugElement.query(By.css('ngx-auth-firebaseui-providers'))).toBeTruthy();
  });

  it('should set avatar image url', async () => {
    const expectedUrl = 'http://example.com';
    const testUser = {photoURL: expectedUrl};
    const fa: any = TestBed.inject(AngularFireAuth);
    fa.user = of(testUser);

    expect(onAuthStateChangedSpy).toHaveBeenCalledWith(jasmine.any(Function));
    const [ cb ] = onAuthStateChangedSpy.calls.mostRecent().args;
    cb(testUser);

    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.avatarImageUrl).toBe(expectedUrl);
    expect(fixture.debugElement.query(By.css('img.avatar'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('mat-icon.avatar'))).toBeNull();
  });

  it('should not set avatar image url when user photo url is null', async () => {
    const testUser = {photoURL: null};
    expect(onAuthStateChangedSpy).toHaveBeenCalledWith(jasmine.any(Function));
    const [ cb ] = onAuthStateChangedSpy.calls.mostRecent().args;
    cb(testUser);
    const fa: any = TestBed.inject(AngularFireAuth);
    fa.user = of(testUser);

    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.avatarImageUrl).toBeNull();
    expect(fixture.debugElement.query(By.css('img.avatar'))).toBeNull();
    expect(fixture.debugElement.query(By.css('mat-icon.avatar'))).toBeTruthy();
  });
});
