import { NgModule } from '@angular/core';
import { SgNotificationComponent, SgNotificationService } from '../components';
import { MatIconModule, MatButtonModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations: [SgNotificationComponent],
    imports: [MatIconModule, MatButtonModule, FlexLayoutModule], // modules needed to run this module
    exports: [SgNotificationComponent],
    providers: [SgNotificationService], // additional providers needed for this module
    entryComponents: [SgNotificationComponent]
})
export class CustomModule {}
