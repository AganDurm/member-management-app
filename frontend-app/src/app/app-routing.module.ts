import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MembersComponent} from './members/members.component';
import {UploaderComponent} from './uploader/uploader.component';
import {MemberDetailComponent} from './member-detail/member-detail.component';

const routes: Routes = [
    { path: '', redirectTo: '/members', pathMatch: 'full' },
    { path: 'members', component: MembersComponent },
    { path: 'upload', component: UploaderComponent },
    { path: 'members/:id', component: MemberDetailComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
