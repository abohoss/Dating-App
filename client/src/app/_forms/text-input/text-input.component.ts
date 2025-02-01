import { NgIf } from '@angular/common';
import { Component, inject, input, Self } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent implements ControlValueAccessor {
  label = input<string>('')
  type = input<string>('text')
  private fb = inject(FormBuilder)

  constructor(@Self() public ngControl: NgControl){
    this.ngControl.valueAccessor = this
  }
    writeValue(obj: any): void {
      
    }
    registerOnChange(fn: any): void {
      
    }
    registerOnTouched(fn: any): void {
      
    }
    setDisabledState?(isDisabled: boolean): void {
      
    }

    get control(): FormControl{
      return this.ngControl.control as FormControl
    }
}
