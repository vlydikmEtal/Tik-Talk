import { canActivateAuth } from "./lib/auth/acces.guard";
import { authTokenInterceptor } from "./lib/auth/auth.interceptor";
import { TokenResponce } from '../../data-access/src/lib/auth/data/interface/auth.interface';
import { AuthService } from "../../data-access/src/lib/auth/data/service/auth.service";
export * from './lib/feature-login'

export {
  canActivateAuth,
  authTokenInterceptor,
  AuthService,
  TokenResponce
}
