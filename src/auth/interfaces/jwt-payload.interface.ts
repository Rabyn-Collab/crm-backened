export interface JwtPayload {
  sub: number;
  email: string;
  tenantId?: number;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER';
}


export interface UserPayload {
  id: number;
  email: string;
  tenantId?: number;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER';
}