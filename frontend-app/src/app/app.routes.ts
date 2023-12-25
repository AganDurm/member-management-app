import { Routes } from '@angular/router';
import {UploaderComponent} from './uploader/uploader.component';
import {MembersComponent} from './members/members.component';
import {MemberDetailComponent} from './member-detail/member-detail.component';

export const routes: Routes = [
    { path: '', redirectTo: '/members', pathMatch: 'full' },
    { path: 'members', component: MembersComponent },
    { path: 'upload', component: UploaderComponent },
    { path: 'members/:id', component: MemberDetailComponent },
];
