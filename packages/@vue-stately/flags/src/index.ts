let tableNestedRowsFlag = false;
let shadowDOMFlag = false;

export function enableTableNestedRows(): void {
  tableNestedRowsFlag = true;
}

export function tableNestedRows(): boolean {
  return tableNestedRowsFlag;
}

export function enableShadowDOM(): void {
  shadowDOMFlag = true;
}

export function shadowDOM(): boolean {
  return shadowDOMFlag;
}
