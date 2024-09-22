import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe, NgIf } from '@angular/common';
import { TextInputComponent } from "../_forms/text-input/text-input.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, NgIf, TextInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private accountservice = inject(AccountService);
  model: any = {};
  @Output() cancelRegister = new EventEmitter();
  private toastr = inject(ToastrService);
  registerForm: FormGroup = new FormGroup({});
  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.maxLength(8), Validators.minLength(4)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
    })
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => {
        this.registerForm.controls['confirmPassword'].updateValueAndValidity();
      }
    })
  }
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: true }
    }
  }
  register() {
    console.log(this.registerForm.value)
    // this.accountservice.register(this.model).subscribe({
    //   next: response => {
    //     console.log(response)
    //     this.cancel();
    //   },
    //   error: error => this.toastr.error(error.error)
    // });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
