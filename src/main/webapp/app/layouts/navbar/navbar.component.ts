import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService } from 'ng-jhipster';

import { ProfileService } from '../profiles/profile.service';
import { JhiLanguageHelper, Principal, LoginModalService, LoginService, NotifyService } from '../../shared';

import { VERSION } from '../../app.constants';

@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: [
        'navbar.scss'
    ]
})
export class NavbarComponent implements OnInit {
    inProduction: boolean;
    isNavbarCollapsed: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    modalRef: NgbModalRef;
    version: string;
    totalNotification: number;
    account: any;

    constructor(
        private loginService: LoginService,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper,
        private principal: Principal,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private router: Router,
        private notifyService: NotifyService
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
    }

    ngOnInit() {
        if (!this.totalNotification) {
            this.totalNotification = 0;
        }
        this.languageHelper.getAll().then((languages) => {
            this.languages = languages;
        });

        this.profileService.getProfileInfo().then((profileInfo) => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });
        this.notifyService.subscribe();
        this.notifyService.receive().subscribe((data) => {
            if (this.account && this.account.login === data.userId) {
                if (data.isLogout){
                    this.totalNotification = 0;
                } else {
                    this.totalNotification = data.total;
                }
            }
        });
    }

    changeLanguage(languageKey: string) {
      this.languageService.changeLanguage(languageKey);
    }

    collapseNavbar() {
        this.isNavbarCollapsed = true;
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.totalNotification = 0;
        this.modalRef = this.loginModalService.open();
    }

    logout() {
        this.collapseNavbar();
        this.loginService.logout();
        this.router.navigate(['']);
        this.totalNotification = 0;
    }

    toggleNavbar() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.principal.getImageUrl() : null;
    }

    increaseTotal() {
        const total = this.totalNotification + 1;
        if (!this.account && this.isAuthenticated()) {
            this.account = this.principal.getAccountLogin();
        }
        const userId = this.account.login;
        this.notifyService.sendActivity(total, userId);
    }

    decreaseTotal() {
        const total = this.totalNotification - 1;
        if (!this.account && this.isAuthenticated()) {
            this.account = this.principal.getAccountLogin();
        }
        const userId = this.account.login;
        this.notifyService.sendActivity(total, userId);
    }
}
