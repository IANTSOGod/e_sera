export class Credentialsresponse {
  public email: string;
  public username: string;
  public photolink: string;
  constructor(mail: string, usr: string, pdp: string) {
    this.email = mail;
    this.username = usr;
    this.photolink = pdp;
  }
}
