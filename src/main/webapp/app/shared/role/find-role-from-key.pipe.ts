import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'findRoleFromKey'})
export class FindRoleFromKeyPipe implements PipeTransform {
    private roles: any = {
        'ROLE_ADMIN': { 'en': 'Administrator', 'vi': 'Quản trị viên' },
        'ROLE_USER': {'en': 'User', 'vi': 'Người dùng' },
        // jhipster-needle-i18n-language-key-pipe - JHipster will add/remove languages in this object
    };
    transform(key: string, langKey: string): string {
        return (this.roles[key])[langKey];
    }
}
