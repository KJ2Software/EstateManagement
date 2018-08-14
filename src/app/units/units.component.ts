import { Component, OnInit } from '@angular/core';
import { UnitModel } from '../../models';

@Component({
    selector: 'app-units',
    templateUrl: './units.component.html',
    styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {
    units: UnitModel[] = [];
    public icon: string = 'build';

    constructor(
    ) { }

    ngOnInit(): void {
    }

}
