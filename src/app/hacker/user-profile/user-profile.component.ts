import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ProfileState } from 'src/app/core/_enums/profileState';
import { EncodeService } from 'src/app/core/_services/encode.service';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { ProfileService } from 'src/app/core/_services/profile.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any;
  loading: boolean = true;
  followerMapping: {[k: string]: string} = { 
    '=0': '0 followers',
    '=1': '1 follower',
    'other': '# followers'
  };

  constructor(
    public hackerService: HackerService,
    public profileService: ProfileService,
    public oidcSecurityService: OidcSecurityService,
    public encodeService: EncodeService,
  ) { }

  ngOnInit(): void {
    this.profileService.loadSubject.subscribe({
      next: (data) => {
        if(data == ProfileState.Load) {
          this.checkUserProfile();
        }
        else if(data == ProfileState.Update) {
          this.getUser();
        }
      }
    })
  }

  checkUserProfile() {
    let decodedData = null;
    const me = sessionStorage.getItem(environment.me);
    if(me) decodedData = this.encodeService.decode(me);

    if(decodedData) {
      const user = JSON.parse(decodedData);
      const authUser = this.oidcSecurityService.getUserData('hacker');
      if(user.email == authUser.email || user.userName == authUser.preferred_username) {
        this.user = user;
        this.setProfilePhoto();
        this.loading = false;
      } else {
        this.getUser();
      }
    } else {
      this.getUser();
    }
  }

  setProfilePhoto() {
    this.user.image = this.user.image ? this.user.image : this.user.fullName ? `https://ui-avatars.com/api/?name=${this.user.fullName}` : this.user.userName ? `https://ui-avatars.com/api/?name=${this.user.userName}` : `https://ui-avatars.com/api/?name=${this.user.email}`;
  }

  getUser() {    
    this.hackerService.getHacker().subscribe(
			result => {
        this.user = result;
        const user = JSON.stringify(result);
        const encodedData = this.encodeService.encode(user);
        sessionStorage.setItem(environment.me, encodedData);
        this.setProfilePhoto();
        this.loading = false;
			}
		)
  }

}
