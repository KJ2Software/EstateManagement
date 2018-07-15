import { IThemeModel } from '../models';

export const environment: { production: boolean, appTitle: string, webApiBaseAddress: string, themes: IThemeModel[], firebase: any } = {
    production: false,
    appTitle: 'EstateManagement',
    webApiBaseAddress: 'http://localhost:5000/api/',
    themes: [
        {
            name: 'Light',
            className: 'light-theme'
        },
        {
            name: 'Dark',
            className: 'dark-theme'
        },
        {
            name: 'Other',
            className: 'other-theme'
        }
    ],
    firebase: {
        apiKey: 'AIzaSyDK0XfYgmCPs2h7BI8BHGguxgGO3Xi-WnE',
        authDomain: 'kj2-estate-management.firebaseapp.com',
        databaseURL: 'https://kj2-estate-management.firebaseio.com',
        projectId: 'kj2-estate-management',
        storageBucket: 'kj2-estate-management.appspot.com',
        messagingSenderId: '234621794994'
    }
};
