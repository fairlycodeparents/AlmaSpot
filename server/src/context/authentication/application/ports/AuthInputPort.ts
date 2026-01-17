export interface AuthInputPort {
  signUp(email: string, password: string): Promise<any>;
  login(email: string, password: string): Promise<any>;
}
