import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-asset-input-output',
  templateUrl: './asset-input-output.component.html',
  styleUrls: ['./asset-input-output.component.css']
})
export class AssetInputOutputComponent implements OnInit {

  @Input('group') inputOutput: FormGroup;
  sealedExpandCollapse: boolean = false;
  rangeExpandCollapse: boolean = false;
  maxError: boolean;
  minError: boolean;
  pvMinError: boolean;
  pvMaxError: boolean;
  rangeMinError: boolean;
  rangeMaxError: boolean;

  constructor() { }

  ngOnInit() {
    if (this.inputOutput.controls['isScalingEnabled'].value) {
      this.sealedExpandCollapse = true;
    }

    if (this.inputOutput.controls['isClampToEuRangeValue'].value) {
      this.rangeExpandCollapse = true;
    }
  }
  // isScalingEnabled
  isScalingEnabled($event) {
    this.sealedExpandCollapse = $event.checked;
    this.inputOutput.controls['isScalingEnabled'].setValue($event.checked);
  }
  // isClampToEuRange
  isClampToEuRange($event) {
    this.rangeExpandCollapse = $event.checked;
    this.inputOutput.controls['isClampToEuRangeValue'].setValue($event.checked);
  }

  // gateway IOTagName
  gatewayIOTagName($event) {
    this.inputOutput.controls['gatewayIOTagName'].setValue($event.target.options[$event.target.options.selectedIndex].text);
  }

  fvMaxValidation() {
    if (this.inputOutput.controls['fvMin'].value == null) {

    } else {
      if (this.inputOutput.controls['fvMin'].value > this.inputOutput.controls['fvMax'].value) {
        this.maxError = true;
      } else {
        this.maxError = false;
      }
    }
  }

  fvMinValidation() {
    if (this.inputOutput.controls['fvMax'].value === null) {

    } else {
      if (this.inputOutput.controls['fvMin'].value > this.inputOutput.controls['fvMax'].value) {
        this.minError = true;
      } else {
        this.minError = false;
      }
    }
  }
  pvMinValidation() {
    if (this.inputOutput.controls['pvMax'].value === null) {

    } else {
      if (this.inputOutput.controls['pvMin'].value > this.inputOutput.controls['pvMax'].value) {
        this.pvMinError = true;
      } else {
        this.pvMinError = false;
      }
    }
  }
  pvMaxValidation() {
    if (this.inputOutput.controls['pvMin'].value == null) {

    } else {
      if (this.inputOutput.controls['pvMin'].value > this.inputOutput.controls['pvMax'].value) {
        this.pvMaxError = true;
      } else {
        this.pvMaxError = false;
      }
    }
  }
  minRangeValue() {
    if (this.inputOutput.controls['euRangeValueMin'].value === null) {

    } else {
      if (this.inputOutput.controls['euRangeValueMin'].value > this.inputOutput.controls['euRangeValueMax'].value) {
        this.rangeMinError = true;
      } else {
        this.rangeMinError = false;
      }
    }
  }

  maxRangeValue() {
    if (this.inputOutput.controls['euRangeValueMin'].value === null) {

    } else {
      if (this.inputOutput.controls['euRangeValueMin'].value > this.inputOutput.controls['euRangeValueMax'].value) {
        this.rangeMaxError = true;
      } else {
        this.rangeMaxError = false;
      }
    }
  }

}
