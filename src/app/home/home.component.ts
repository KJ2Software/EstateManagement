import { Component, OnInit } from '@angular/core';
import { EstateFirebaseServiceProvider } from '../../services';
import { CallbackModel } from '../../models';
import { SgNotificationService } from '../../components';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    private estate = undefined;
    constructor(private estateService: EstateFirebaseServiceProvider, private _notificationService: SgNotificationService) { }

    ngOnInit() { 
        this.getEstate();
    }


    getEstate() {
        this.estateService.getRecord(localStorage.getItem('estateKey'), (e) => this.getEstateCallback(e));
    }

    getEstateCallback(callbackModel: CallbackModel) {
        if (callbackModel.success) {
            this.estate = callbackModel.data;
        } else {
            this._notificationService.displayMessage(callbackModel.data.message);
        }
    }
}
