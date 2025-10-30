export class ApiResponse<T = unknown> {
  constructor(
    public success: boolean,
    public msg: string = "",
    public data: T | null = null,
  ) {}
}

/* usage
const res = new ApiResponse(true, "ok", { a: 1 });
console.log(res);
*/
