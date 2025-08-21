import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent {
  fullName = '';
  email = '';
  message = '';

  constructor(private contactService: ContactService) {}

  onSubmit() {
    if (!this.fullName || !this.email || !this.message) {
      alert('Please fill out all fields');
      return;
    }
    this.contactService
      .sendMessage({
        fullName: this.fullName,
        email: this.email,
        message: this.message,
      })
      .subscribe({
        next: () => {
          alert('Message sent successfully!');
          this.fullName = '';
          this.email = '';
          this.message = '';
        },
        error: () => alert('Failed to send message'),
      });
  }
}
