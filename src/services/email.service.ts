import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { EmailModel } from '../models';
import { environment } from '../environments/environment';

declare var emailjs: any;

@Injectable()
export class EmailService {

    constructor() {
    }

    sendEmail(emailModel: EmailModel, callbackMethod) {
        let serviceId = environment.emailConfig.serviceId;
        let templateId = environment.emailConfig.templateId;
        let templateParams = {
            to: emailModel.to,
            to_name: emailModel.toName,
            from_name: emailModel.fromName,
            message_html: emailModel.messageHtml,
            reply_to: emailModel.replyTo
        };

        emailjs.send(serviceId, templateId, templateParams).then((response) => {
            callbackMethod({ success: true, data: response.text });
        }, function (error) {
            callbackMethod({ success: false, data: error });
        });
    }
}
