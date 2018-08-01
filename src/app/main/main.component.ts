import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Event, NavigationEnd, Route, Router, Routes } from '@angular/router';
import { mainRouterTransition } from '../../animations';
import { environment } from '../../environments/environment';
import { TokenModel, UserModel } from '../../models';
import { AppStore, AuthStore } from '../../stores';
import { AngularFireModule } from 'angularfire2';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    animations: [mainRouterTransition],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
    currentRoute: string;
    currentRouteIcon: string;
    token: TokenModel = new TokenModel();
    // user: UserModel = new UserModel();
    appTitle: string = environment.appTitle;
    pageTitle: string;
    mainMenuRoutes: Routes = [];
    userRoutes: Routes;

    constructor(
        private _router: Router,
        private _titleService: Title,
        private _authStore: AuthStore,
        public _appStore: AppStore,
        private _currentRoute: ActivatedRoute) {
        _router.events.subscribe((event: Event) => this.routeChangedEvent(event));

        // this._authStore.token.subscribe((res: TokenModel) => {
        //     this.token = res;
        // });

        // this._authStore.user.subscribe((res: UserModel) => {
        //     this.user = res;
        // });
    }

    ngOnInit(): void {
        this.initMainMenuRoutes(this._router.config);
        this.mainMenuRoutes.sort((a, b) => a.data.seq - b.data.seq);
    }

    initMainMenuRoutes(routes: Route[]) {
        routes.forEach((route) => {

            if (route.data && route.data.show) {
                this.mainMenuRoutes.push(route);
            }

            if (route.children) {
                this.initMainMenuRoutes(route.children);
            }
        });
    }

    routeChangedEvent(event: Event): void {
        if (event instanceof NavigationEnd) {
            let routeData: any = this._currentRoute.snapshot.children[0].data;
            this._titleService.setTitle(environment.appTitle + ' | ' + routeData.title);
            this.pageTitle = routeData.title;
            this.currentRoute = routeData.url;
            this.currentRouteIcon = routeData.icon;
        }
    }

    logout(): void {
        this._authStore.logout();
    }
}
