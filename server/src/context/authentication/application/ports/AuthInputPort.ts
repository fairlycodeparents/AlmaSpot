export interface AuthInputPort {
  signUp(email: string, password: string): Promise<void>;
  login(email: string, password: string): Promise<string>;
}
