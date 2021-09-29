import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GenericValidator } from 'src/app/shared/generic-validator';
import { Admin } from 'src/app/shared/models/adminModel';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldsComponent implements OnInit, AfterViewInit {

  @Input() registerData: boolean;
  @Input() pageTitle: string;

  @Output() valueChange: EventEmitter<Admin> = new EventEmitter<Admin>();

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errorMessage: string;
  registerForm: FormGroup;

  admin: Admin;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private formBuilder: FormBuilder) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      userName: {
        required: '',
        minlength: 'User name must be at least 6 characters.',
        maxlength: 'User name cannot exceed 12 characters.',
        pattern: 'Special characters not allowed'
      },
      displayName: {
        required: '',
        minlength: 'Display name must be at least 6 characters.',
        maxlength: 'Display name cannot exceed 12 characters.',
        pattern: 'Special characters not allowed'
      },
      password: {
        required: '',
        minlength: 'password must be at least 6 characters.',
        maxlength: 'password cannot exceed 12 characters.'
      },
      employerName: {
        required: '',
        minlength: 'Employer name must be at least 3 characters.',
        maxlength: 'Employer name cannot exceed 12 characters.',
        pattern: 'Special characters not allowed'
      },
      teamName: {
        required: '',
        minlength: 'Team name must be at least 3 characters.',
        maxlength: 'Team name cannot exceed 12 characters.',
        pattern: 'Special characters not allowed'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);

  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      userName: ['', [Validators.required,
      Validators.minLength(6),
      Validators.maxLength(12),
      Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$')]],

      displayName: [''],

      password: ['', [Validators.required,
      Validators.minLength(6),
      Validators.maxLength(12)]],

      employerName: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(12),
      Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$')]],

      teamName: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(12),
      Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$')]],

      isActive: [true]
    });

    if (this.registerData) {
      const displayNameControl = this.registerForm.get('displayName');
      displayNameControl?.setValidators([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
        Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$')]);
    }
  }

  ngAfterViewInit(): void {

    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.registerForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.registerForm);
    });
  }

  Register() {
    if (this.registerForm.valid) {
      if (this.registerForm.dirty) {
        //console.log(this.registerForm.value);
        const adminData = { ...this.admin, ...this.registerForm.value };
        this.valueChange.emit(adminData);
      }
      else {
        this.registerForm.reset();
      }
    }
  }

}
