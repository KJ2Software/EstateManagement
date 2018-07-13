import { IThemeModel } from '../models';

export const environment: { production: boolean, appTitle: string, webApiBaseAddress: string, themes: IThemeModel[] } = {
    production: true,
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
    ]
};
