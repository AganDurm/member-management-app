import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api-response';
import {Member} from '../../model/member';
import {File} from '../../model/file';
import {ChangedMembersData} from '../../model/changed-members-data';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly uploadUrl: string;
  private readonly excelUploadUrl: string;
  private readonly pdfUploadUrl: string;

  private readonly membersUrl: string;
  private readonly memberUrl: string;
  private readonly membersCountUrl: string;
  private readonly updateMemberActiveStatusUrl: string;
  private readonly updateMemberUsernameUrl: string;
  private readonly updateMemberPasswordUrl: string;
  private readonly updateMemberKundennummerUrl: string;
  private readonly updateMemberMitgliedsnummerUrl: string;
  private readonly deleteAllMembersUrl: string;
  private readonly deleteMemberByIdUrl: string;
  private readonly findAllFilesByMemeberIdUrl: string;
  private readonly findAllFilesByMemeberIdAndGameUrl: string;

  private readonly downloadFileByUserIdUrl: string;
  private readonly deletePdfFileByMemberIdAndFileNameUrl: string;

  constructor(private http: HttpClient) {
    this.membersUrl = 'http://localhost:8080/members';
    this.memberUrl = 'http://localhost:8080/members/';

    this.uploadUrl = 'http://localhost:8080/upload/';
    this.excelUploadUrl = this.uploadUrl + 'excelUpload';

    this.pdfUploadUrl = this.uploadUrl;

    this.membersCountUrl = this.memberUrl + 'countMembers';
    this.updateMemberActiveStatusUrl = this.memberUrl + 'updateMemberActiveStatus';
    this.updateMemberUsernameUrl = this.memberUrl + 'updateMemberUsername';
    this.updateMemberPasswordUrl = this.memberUrl + 'updateMemberPassword';
    this.updateMemberKundennummerUrl = this.memberUrl + 'updateMemberKundennummer';
    this.updateMemberMitgliedsnummerUrl = this.memberUrl + 'updateMemberMitgliedsnummer';
    this.deleteAllMembersUrl = this.memberUrl + 'deleteAll';
    this.deleteMemberByIdUrl = this.memberUrl + 'delete/';
    this.findAllFilesByMemeberIdUrl = this.memberUrl;
    this.findAllFilesByMemeberIdAndGameUrl = this.memberUrl;

    this.downloadFileByUserIdUrl = this.memberUrl;
    this.deletePdfFileByMemberIdAndFileNameUrl = this.memberUrl;
  }

  public uploadExcelFile(formData: FormData): Observable<string> {
    return this.http.post<string>(this.excelUploadUrl, formData);
  }

  public uploadPdfFiles(formData: FormData, memberId: number | null): Observable<File[]> {
    return this.http.post<File[]>(this.pdfUploadUrl + memberId + '/pdf', formData)
  }

  public findAllPdfFilesByMemberId(memberId: number | null): Observable<File[]> {
    return this.http.get<File[]>(this.findAllFilesByMemeberIdUrl + memberId + '/files');
  }

  public findAllFilesByMemeberIdAndGame(memberId: number, game: string): Observable<File[]> {
    return this.http.get<File[]>(this.findAllFilesByMemeberIdAndGameUrl + memberId + "/" + game + "/files")
  }

  public countMembers(): Observable<number> {
    return this.http.get<number>(this.membersCountUrl);
  }

  public findAll(): Observable<Member[]> {
    return this.http.get<Member[]>(this.membersUrl);
  }

  public findById(memberId: number): Observable<Member> {
    return this.http.get<Member>(this.memberUrl + memberId);
  }

  public updateMemberActiveStatus(memberId: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateMemberActiveStatusUrl, memberId);
  }

  public updateMemberUsername(changedMembersData: ChangedMembersData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateMemberUsernameUrl, changedMembersData);
  }

  public updateMemberPassword(changedMembersData: ChangedMembersData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateMemberPasswordUrl, changedMembersData);
  }

  public updateMemberKundennummer(changedMembersData: ChangedMembersData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateMemberKundennummerUrl, changedMembersData);
  }

  public updateMemberMitgliedsnummer(changedMembersData: ChangedMembersData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateMemberMitgliedsnummerUrl, changedMembersData);
  }

  public deleteMemberById(memberId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.deleteMemberByIdUrl + memberId);
  }

  public deleteAllMembers(): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.deleteAllMembersUrl);
  }

  public downloadFileByUserId(memberId: number, fileName: string): Observable<Blob> {
    return this.http.get<Blob>(this.downloadFileByUserIdUrl + memberId + "/" + fileName + "/download", { responseType: 'blob' as 'json' });
  }

  public deletePdfFileByMemberIdAndFileName(memberId: number, fileName: string): Observable<ApiResponse> {
    const url = this.deletePdfFileByMemberIdAndFileNameUrl + memberId + '/' + fileName + '/' + 'delete';
    return this.http.delete<ApiResponse>(url);
  }
}
