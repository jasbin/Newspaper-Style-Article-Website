import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  username = '';
  today = new Date();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.authStatus$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        const user = this.authService.getCurrentUser();
        if (user) this.username = user.username;
      } else {
        this.username = '';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
  }
}
