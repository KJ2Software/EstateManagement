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
import { AppStore, AuthStore } from '../stores';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { DynamicDashboardsModule } from '@sgits/dynamic-dashboards';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import {
    AuthFirebaseServiceProvider,
    UserFirebaseServiceProvider,
    EstateFirebaseServiceProvider,
    ApprovalSetupFirebaseServiceProvider,
    ApprovalFirebaseServiceProvider,
    ApprovalItemFirebaseServiceProvider,
    ApprovalItemResultFirebaseServiceProvider
} from '../services';
import { EstateDialogComponent } from './estate-dialog/estate-dialog.component';
import { MatDialogModule } from '../../node_modules/@angular/material';
import { ApprovalTypesComponent } from './approval-types/approval-types.component';
import { NoteTypesComponent } from './note-types/note-types.component';
import { NoteTypeComponent } from './note-types/note-type/note-type.component';
import { ApprovalTypeComponent } from './approval-types/approval-type/approval-type.component';
import { ApprovalSetupsComponent } from './approval-setups/approval-setups.component';
import { ApprovalSetupComponent } from './approval-setups/approval-setup/approval-setup.component';
import { EmptyStateComponent } from '../components/empty-state/empty-state.component';
import { NotesComponent } from './notes/notes.component';
import { ResidentsComponent } from './residents/residents.component';
import { ResidentComponent } from './residents/resident/resident.component';
import { OwnersComponent } from './owners/owners.component';
import { OwnerComponent } from './owners/owner/owner.component';

import { ApprovalsComponent } from './approvals/approvals.component';
import { ApprovalComponent } from './approvals/approval/approval.component';
import { ApprovalItemsComponent } from './approvals/approval-items/approval-items.component';
import { ApprovalItemComponent } from './approvals/approval-items/approval-item/approval-item.component';

import {
    AuthService,
    HttpErrorService,
    ApprovalTypeFirebaseServiceProvider,
    CommonService,
    NoteTypeFirebaseServiceProvider,
    OwnerFirebaseServiceProvider,
    FirebaseFunctionService,
    ResidentFirebaseServiceProvider,
    EmailService
} from '../services';

const httpInterceptorProviders: Type<any>[] = [RequestInterceptor];

@NgModule({
    declarations: [
        AppComponent,
        routedComponents,
        HomeComponent,
        EstateDialogComponent,
        ApprovalTypesComponent,
        ApprovalTypeComponent,
        ApprovalSetupsComponent,
        ApprovalSetupComponent,
        NoteTypesComponent,
        NoteTypeComponent,
        EmptyStateComponent,
        NoteTypesComponent,
        NotesComponent,
        ResidentsComponent,
        ResidentComponent,
        OwnersComponent,
        OwnerComponent,
        ApprovalsComponent,
        ApprovalComponent,
        ApprovalItemsComponent,
        ApprovalItemComponent
    ],
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
        ApprovalSetupFirebaseServiceProvider,
        ApprovalTypeFirebaseServiceProvider,
        NoteTypeFirebaseServiceProvider,
        OwnerFirebaseServiceProvider,
        ResidentFirebaseServiceProvider,
        CommonService,
        FirebaseFunctionService,
        EmailService,
        ApprovalFirebaseServiceProvider,
        ApprovalItemFirebaseServiceProvider,
        ApprovalItemResultFirebaseServiceProvider
    ],
    exports: [],
    bootstrap: [AppComponent],
    entryComponents: [EstateDialogComponent]
})
export class AppModule {}
