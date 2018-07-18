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
                data: { roles: [], url: '/approval-types', title: 'Approval Types', icon: 'home', show: true, seq: 1 }
            },
            {
                path: 'approval-types/:approvalTypeKey',
                component: ApprovalTypeComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/approval-types/approval-type', title: 'Approval Type', icon: 'home', show: false, seq: 1 }
            },
            {
                path: 'approval-setups',
                component: ApprovalSetupsComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/approval-setups', title: 'Approval Setup', icon: 'home', show: true, seq: 1 }
            },
            {
                path: 'approval-setups/:approvalSetupKey',
                component: ApprovalSetupComponent,
                canActivate: [RouteGuard],
                data: { roles: [], url: '/approval-setups/approval-setup', title: 'Approval Setup', icon: 'home', show: false, seq: 1 }
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
