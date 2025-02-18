// user-dialog.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-user-dialog',
    templateUrl: './dialog-add-users.component.html',
    styleUrls: ['./dialog-add-users.component.scss'],
})

export class DialogAddUsers{
    userForm: FormGroup;

    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<DialogAddUsers>
    ) {
      this.userForm = this.fb.group({
        userName: ['', Validators.required],
        password: ['', Validators.required],
        address: [''],
        phoneNumber: ['', Validators.pattern('^[0-9]{10}$')]
      });
    }
  
    // ngOnInit(): void {

    // }
  
    onSubmit(): void {
      if (this.userForm.valid) {
        this.dialogRef.close(this.userForm.value);
      }
    }
  
    onCancel(): void {
      this.dialogRef.close();
    }
}