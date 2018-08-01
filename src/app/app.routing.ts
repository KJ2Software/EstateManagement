import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RouteGuard } from '../guards/route.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ApprovalTypeComponent } from './approval-types/approval-type/approval-type.component';
import { ApprovalTypesComponent } from './approval-types/approval-types.component';
import { ApprovalSetupsComponent } from './approval-setups/approval-setups.component';
import { ApprovalSetupComponent } from './approval-setups/approval-setup/approval-setup.component';
import { CreateApprovalComponent } from './create-approval/create-approval.component';
import { NoteTypesComponent } from './note-types/note-types.component';
import { NoteTypeComponent } from './note-types/note-type/note-type.component';
import { OwnersComponent } from './owners/owners.component';
import { OwnerComponent } from './owners/owner/owner.component';
import { ResidentsComponent } from './residents/residents.component';
import { ResidentComponent } from './residents/resident/resident.component';
// import { DynamicDashboardsContainerComponent, DynamicWidgetDetailComponent } from '@sgits/dynamic-dashboards';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: { roles: [], url: '/login', title: 'Login', icon: 'exit_to_app', show: false, seq: 0 }
    },
    {
        path: '',
        component: MainComponent,
        canActivate: [RouteGuard],
        children: [
            {
                path: '',
                component: HomeComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/', title: 'Home', icon: 'home', show: true, seq: 1 }
            },
            {
                path: 'approval-types',
                component: ApprovalTypesComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/approval-types', title: 'Approval Types', icon: 'thumb_up', show: true, seq: 1 }
            },
            {
                path: 'approval-types/:approvalTypeKey',
                component: ApprovalTypeComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/approval-types/approval-type', title: 'Approval Type', icon: 'thumb_up', show: false, seq: 1 }
            },
            {
                path: 'approval-setups',
                component: ApprovalSetupsComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/approval-setups', title: 'Approval Setups', icon: 'build', show: true, seq: 1 }
            },
            {
                path: 'approval-setups/:approvalSetupKey',
                component: ApprovalSetupComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/approval-setups/approval-setup', title: 'Approval Setup', icon: 'home', show: false, seq: 1 }
            },
            {
                path: 'create-approval',
                component: CreateApprovalComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/create-approval', title: 'Create Approval', icon: 'gavel', show: true, seq: 1 }
            },
            {
                path: 'note-types',
                component: NoteTypesComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/note-types', title: 'Note Types', icon: 'insert_comment', show: true, seq: 1 }
            },
            {
                path: 'note-types/:noteTypeKey',
                component: NoteTypeComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/note-types/note-type', title: 'Note Type', icon: 'insert_comment', show: false, seq: 1 }
            },
            {
                path: 'owners',
                component: OwnersComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/owners', title: 'Owners', icon: 'person', show: true, seq: 1 }
            },
            {
                path: 'owners/:ownerKey',
                component: OwnerComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/owners/owner', title: 'Owner', icon: 'person', show: false, seq: 1 }
            },
            {
                path: 'residents',
                component: ResidentsComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/residents', title: 'Residents', icon: 'people', show: true, seq: 1 }
            },
            {
                path: 'residents/:residentKey',
                component: ResidentComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/residents/resident', title: 'Resident', icon: 'people', show: false, seq: 1 }
            }

            // {
            //     path: '',
            //     component: DynamicDashboardsContainerComponent,
            //     canActivate: [RouteGuard],
            //     data: { roles: [], url: '/', title: 'Dashboards', icon: 'widgets', show: true, seq: 1 }
            // },
            // {
            //     path: 'widget-detail',
            //     component: DynamicWidgetDetailComponent,
            //     canActivate: [RouteGuard],
            //     data: { roles: [], url: '', title: 'Widget Detail', icon: '', show: false, seq: 0 }
            // },
            // {
            //     path: 'users',
            //     component: UsersComponent,
            //     canActivate: [RouteGuard],
            //     data: { roles: [], url: '/users', title: 'Users', icon: 'person', show: true, seq: 3 }
            // },
            // {
            //     path: 'users/:id',
            //     component: UserComponent,
            //     canActivate: [RouteGuard],
            //     data: { roles: [], url: '', title: 'User', icon: 'person', show: false, seq: 0 }
            // },
            // {
            //     path: 'profile',
            //     component: ProfileComponent,
            //     canActivate: [RouteGuard],
            //     data: { roles: [], url: '/profile', title: 'Profile', icon: 'account_circle', show: false, seq: 0 }
            // }
        ]
    },
    // {
    //     path: 'forgot-password',
    //     component: ForgotPasswordComponent,
    //     data: { roles: [], url: '/forgot-password', title: 'Forgot Password', icon: 'lock_outline', show: false, seq: 0 }
    // },
    // {
    //     path: 'reset-password/:userId/:token',
    //     component: ResetPasswordComponent,
    //     data: { roles: [], url: '/reset-password', title: 'Forgot Password', icon: 'lock_outline', show: false, seq: 0 }
    // },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: false })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }

export const routedComponents: any[] = [
    MainComponent,
    LoginComponent,
    PageNotFoundComponent
];
