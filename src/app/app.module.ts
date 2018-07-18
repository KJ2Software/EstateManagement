import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Type } from '@angular/core';
import 'hammerjs';
import { CommonModule } from '@angular/common';
import { CovalentHttpModule } from '@covalent/http';
import { AppComponent } from './app.component';
import { RequestInterceptor } from './app.interceptor';
import { routedComponents, AppRoutingModule } from './app.routing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SharedModule, CustomModule } from '../modules';
import { RouteGuard } from '../guards/route.guard';
import { AuthService, HttpErrorService, ApprovalConfigFirebaseServiceProvider, ApprovalTypeFirebaseServiceProvider } from '../services';
import { AppStore, AuthStore } from '../stores';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { DynamicDashboardsModule } from '@sgits/dynamic-dashboards';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AuthFirebaseServiceProvider, UserFirebaseServiceProvider, EstateFirebaseServiceProvider } from '../services';
import { EstateDialogComponent } from './estate-dialog/estate-dialog.component';
import { MatDialogModule } from '../../node_modules/@angular/material';
import { ApprovalConfigComponent } from './approval-config/approval-config.component';
import { ApprovalTypesComponent } from './approval-types/approval-types.component';
import { ApprovalTypeComponent } from './approval-types/approval-type/approval-type.component';

const httpInterceptorProviders: Type<any>[] = [RequestInterceptor];

@NgModule({
    declarations: [AppComponent, routedComponents, HomeComponent, EstateDialogComponent,
        ApprovalConfigComponent, ApprovalTypesComponent, ApprovalTypeComponent],
    imports: [
        MatDialogModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule.enablePersistence(),
        // AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        AppRoutingModule,
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        // DynamicDashboardsModule.forRoot(environment.webApiBaseAddress),
        CommonModule,
        InfiniteScrollModule,
        CustomModule,
        CovalentHttpModule.forRoot({
            interceptors: [
                {
                    interceptor: RequestInterceptor,
                    paths: ['**']
                }
            ]
        })
    ],
    providers: [
        httpInterceptorProviders,
        Title,
        RouteGuard,
        AuthService,
        HttpErrorService,
        AppStore,
        AuthStore,
        AuthFirebaseServiceProvider,
        UserFirebaseServiceProvider,
        EstateFirebaseServiceProvider,
        ApprovalConfigFirebaseServiceProvider,
        ApprovalTypeFirebaseServiceProvider
    ],
    exports: [],
    bootstrap: [AppComponent],
    entryComponents: [EstateDialogComponent]
})
export class AppModule {}
