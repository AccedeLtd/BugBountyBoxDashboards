import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  simple() {
    Swal.fire('Simple Notification');
  }

  success(title?: string, text?: string,) {
    Swal.fire(
      title || 'Heya!',
      text || 'Operation successful',
      'success'
    )
  }

  error(title?: string, text?: string,) {
    Swal.fire(
      title || 'Oops!',
      text || 'Something went wrong',
      'error'
    )
  }
  
  info(title?: string, text?: string,) {
    Swal.fire(
      title || 'Info!',
      text || 'Something went wrong',
      'info'
    )
  }

  confirm(title?: string, text?: string, confirmButtonText?: string, cancelButtonText?: string, html?: string) {
    return Swal.fire({
      title: title || 'Are you sure?',
      text: text || 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText || 'Yes',
      cancelButtonText: cancelButtonText || 'Cancel',
      html: html || ''
    })
  }

  async confirmInput(title?: string, text?: string, inputPlaceholder?: string, confirmButtonText?: string, cancelButtonText?: string) {
    const { value: input } = await Swal.fire({
      title: title || 'Input here',
      input: 'text',
      inputPlaceholder: inputPlaceholder || '',
      text: text || 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText || 'Yes',
      confirmButtonColor: '#E70023',
      cancelButtonText: cancelButtonText || 'Cancel'
    })

    if (input) {
      return input;
    }
  }

  async emailNotification() {
    const { value: email } = await Swal.fire({
      position: 'bottom-end',
      title: 'Input email address',
      input: 'email',
      inputPlaceholder: 'Enter your email address'
    })

    if (email) {
      Swal.fire(`Entered email: ${email}`)
    }
  }
}