export class BaseResponse<T = any> {
  success = true;
  message = "";
  data: T;
  constructor(params: Partial<BaseResponse>) {
    this.data = params.data;
    Object.assign(this, params);
  }
}
