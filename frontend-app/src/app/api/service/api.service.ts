import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api-response';
import {Member} from '../../model/member';
import {File} from '../../model/file';
import {ChangedMembersData} from '../../model/changed-members-data';
import {Orders} from '../../model/orders';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly rootOrigin: string;
  private readonly uploadUrl: string;
  private readonly excelUploadUrl: string;
  private readonly pdfUploadUrl: string;
  private readonly membersUrl: string;
  private readonly ordersUrl: string;
  private readonly createOrderUrl: string;
  private readonly updateOrderUrl: string;
  private readonly deleteOrderUrl: string;
  private readonly memberUrl: string;
  private readonly membersCountUrl: string;
  private readonly updateMemberActiveStatusUrl: string;
  private readonly updateMemberUsernameUrl: string;
  private readonly updateMemberPasswordUrl: string;
  private readonly updateMemberKundennummerUrl: string;
  private readonly updateMemberMitgliedsnummerUrl: string;
  private readonly updateMemberCardNumberUrl: string;
  private readonly updateMemberVisaOrMcUrl: string;
  private readonly updateMemberMonthUrl: string;
  private readonly updateMemberYearUrl: string;
  private readonly updateMemberCvcUrl: string;
  private readonly updateMemberNameOnCardUrl: string;
  private readonly updateMemberGebUrl: string;
  private readonly updateMemberPLZUrl: string;
  private readonly updateMemberStreetUrl: string;
  private readonly updateMemberCityUrl: string;
  private readonly deleteAllMembersUrl: string;
  private readonly deleteMemberByIdUrl: string;
  private readonly findAllFilesByMemeberIdUrl: string;
  private readonly findAllFilesByMemeberIdAndGameUrl: string;
  private readonly downloadFileByUserIdUrl: string;
  private readonly deletePdfFileByMemberIdAndFileNameUrl: string;

  constructor(private http: HttpClient) {
    this.rootOrigin = 'http://localhost:8080';
    this.ordersUrl = this.rootOrigin + '/orders';
    this.createOrderUrl = this.rootOrigin + '/orders/create';
    this.updateOrderUrl = this.rootOrigin + '/orders/updateOrder';
    this.deleteOrderUrl = this.rootOrigin + '/orders/deleteOrder/';
    this.membersUrl = this.rootOrigin + '/members';
    this.memberUrl =  this.rootOrigin + '/members/';
    this.uploadUrl = this.rootOrigin + '/upload/';
    this.excelUploadUrl = this.uploadUrl + 'excelUpload';
    this.pdfUploadUrl = this.uploadUrl;
    this.membersCountUrl = this.memberUrl + 'countMembers';
    this.updateMemberActiveStatusUrl = this.memberUrl + 'updateMemberActiveStatus';
    this.updateMemberUsernameUrl = this.memberUrl + 'updateMemberUsername';
    this.updateMemberPasswordUrl = this.memberUrl + 'updateMemberPassword';
    this.updateMemberKundennummerUrl = this.memberUrl + 'updateMemberKundennummer';
    this.updateMemberMitgliedsnummerUrl = this.memberUrl + 'updateMemberMitgliedsnummer';
    this.updateMemberCardNumberUrl = this.memberUrl + 'updateMemberCardNumber';
    this.updateMemberVisaOrMcUrl = this.memberUrl + 'updateMemberVisaOrMc';
    this.updateMemberMonthUrl = this.memberUrl + 'updateMemberMonth';
    this.updateMemberYearUrl = this.memberUrl + 'updateMemberYear';
    this.updateMemberCvcUrl = this.memberUrl + 'updateMemberCvc';
    this.updateMemberNameOnCardUrl = this.memberUrl + 'updateMemberNameOnCard';
    this.updateMemberGebUrl = this.memberUrl + 'updateMemberGeb';
    this.updateMemberPLZUrl = this.memberUrl + 'updateMemberPLZ';
    this.updateMemberStreetUrl = this.memberUrl + 'updateMemberStreet';
    this.updateMemberCityUrl = this.memberUrl + 'updateMemberCity';
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
    return this.http.get<File[]>(this.findAllFilesByMemeberIdUrl + memberId + '/userFiles');
  }

  public findAllPdfFilesByGameName(gameName: string): Observable<File[]> {
    return this.http.get<File[]>(this.findAllFilesByMemeberIdUrl + gameName + '/gameFiles');
  }

  public findAllPdfFiles(): Observable<File[]> {
    return this.http.get<File[]>(this.findAllFilesByMemeberIdUrl + 'gameFiles');
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

  public updateMemberCardNumber(changedMembersData: ChangedMembersData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateMemberCardNumberUrl, changedMembersData);
  }

  public updateMemberVisaOrMc(changedMembersData: ChangedMembersData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateMemberVisaOrMcUrl, changedMembersData);
  }

  public updateMemberMonth(changedMembersData: ChangedMembersData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateMemberMonthUrl, changedMembersData);
  }

  public updateMemberYear(changedMembersData: ChangedMembersData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateMemberYearUrl, changedMembersData);
  }

  public updateMemberCvc(changedMembersData: ChangedMembersData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateMemberCvcUrl, changedMembersData);
  }

  public updateMemberNameOnCard(changedMembersData: ChangedMembersData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateMemberNameOnCardUrl, changedMembersData);
  }

  public updateMemberGeb(changedMembersData: ChangedMembersData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateMemberGebUrl, changedMembersData);
  }

  public updateMemberPLZ(changedMembersData: ChangedMembersData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateMemberPLZUrl, changedMembersData);
  }

  public updateMemberStreet(changedMembersData: ChangedMembersData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateMemberStreetUrl, changedMembersData);
  }

  public updateMemberCity(changedMembersData: ChangedMembersData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateMemberCityUrl, changedMembersData);
  }

  public deleteMemberById(memberId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.deleteMemberByIdUrl + memberId);
  }

  public deleteAllMembers(): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.deleteAllMembersUrl);
  }

  public downloadFileByUserId(memberId: number, fileName: string, game: string): Observable<Blob> {
    return this.http.get<Blob>(this.downloadFileByUserIdUrl + memberId + "/" + fileName + "/" + game + "/download", { responseType: 'blob' as 'json' });
  }

  public downloadAllFilesByGameName(game: string): Observable<Blob> {
    return this.http.get<Blob>(this.downloadFileByUserIdUrl + game + "/download", { responseType: 'blob' as 'json' });
  }

  public deletePdfFileByMemberIdAndFileName(memberId: number, fileName: string, game: string): Observable<ApiResponse> {
    const url = this.deletePdfFileByMemberIdAndFileNameUrl + memberId + '/' + fileName + '/' + game + '/' + 'delete';
    return this.http.delete<ApiResponse>(url);
  }

  public findAllOrders(): Observable<Orders[]> {
    return this.http.get<Orders[]>(this.ordersUrl);
  }

  public saveNewOrder(newGame: Orders): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.createOrderUrl, newGame);
  }

  public updateOrder(newGame: Orders): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.updateOrderUrl, newGame);
  }

  public deleteOrderById(gameId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.deleteOrderUrl + gameId);
  }
}
